/**
 * Auth.js Configuration
 * Google OAuth authentication for RescueStream Dashboard
 * with domain and email allowlist authorization
 */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import {
  loadAllowlistConfig,
  checkAllowlist,
  logAccessDenied,
} from '@/lib/auth/allowlist';
import { getRescueStreamClient } from '@/lib/api/client';
import type { DenyReason } from '@/types/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only check for OAuth providers
      if (account?.provider === 'google') {
        const email = (profile?.email || user.email) as string | undefined;
        const config = loadAllowlistConfig();
        const result = checkAllowlist(email, config);

        if (!result.allowed) {
          // Log the denied access attempt
          logAccessDenied(email || 'unknown', result.reason as DenyReason);
          // Redirect to access denied page
          return '/access-denied';
        }
      }
      return true;
    },
    jwt({ token, user, profile, account }) {
      // On initial sign-in, user, profile, and account are available
      if (user) {
        token.picture = user.image;
        token.email = user.email;
      }
      if (profile?.picture) {
        token.picture = profile.picture as string;
      }
      if (profile?.email) {
        token.email = profile.email as string;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.image = (token.picture as string) || null;
        (session.user as { provider?: string }).provider =
          token.provider as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith('/streams') ||
        nextUrl.pathname.startsWith('/broadcasters') ||
        nextUrl.pathname.startsWith('/stream-keys');
      const isAccessDenied = nextUrl.pathname === '/access-denied';

      // Allow access to the access-denied page without auth
      if (isAccessDenied) {
        return true;
      }

      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false; // Redirect unauthenticated users to login page
        }

        // Re-validate allowlist on each navigation (FR-013)
        const email = auth?.user?.email;
        const config = loadAllowlistConfig();
        const result = checkAllowlist(email, config);

        if (!result.allowed) {
          logAccessDenied(email || 'unknown', result.reason as DenyReason);
          return Response.redirect(new URL('/access-denied', nextUrl));
        }

        return true;
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/streams', nextUrl));
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const client = getRescueStreamClient();
        await client.createAuditLog({
          event_type: 'login',
          actor: user.email || 'unknown',
          request_method: 'POST',
          request_path: '/api/auth/callback/google',
          outcome: 'success',
          metadata: {
            user_name: user.name,
          },
        });
      } catch (error: unknown) {
        // Log error but don't block sign-in
        console.error('Failed to create login audit log:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
    },
    async signOut(message) {
      try {
        const client = getRescueStreamClient();
        // Auth.js provides token for JWT strategy, session for database strategy
        const email =
          'token' in message
            ? (message.token?.email as string | undefined)
            : undefined;
        await client.createAuditLog({
          event_type: 'logout',
          actor: email || 'unknown',
          request_method: 'POST',
          request_path: '/api/auth/signout',
          outcome: 'success',
        });
      } catch (error: unknown) {
        // Log error but don't block sign-out
        console.error('Failed to create logout audit log:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
    },
  },
});
