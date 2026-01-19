/**
 * Auth.js Configuration
 * Google OAuth authentication for RescueStream Dashboard
 */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

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
    jwt({ token, user, profile, account }) {
      // On initial sign-in, user, profile, and account are available
      if (user) {
        token.picture = user.image;
      }
      if (profile?.picture) {
        token.picture = profile.picture as string;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.image = (token.picture as string) || null;
        (session.user as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/streams') ||
        nextUrl.pathname.startsWith('/broadcasters') ||
        nextUrl.pathname.startsWith('/stream-keys');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/streams', nextUrl));
      }
      return true;
    },
  },
});
