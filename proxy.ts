import { auth } from '@/lib/auth';

export const proxy = auth;

export const config = {
  matcher: [
    // Match all paths except static files and api routes (except auth)
    '/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)',
  ],
};
