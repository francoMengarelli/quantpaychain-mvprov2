
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// DEMO MODE: Middleware with graceful error handling
export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/documents/:path*',
    '/api/usage/:path*'
  ]
};
