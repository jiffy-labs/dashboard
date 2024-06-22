// // Protecting routes with next-auth
// // https://next-auth.js.org/configuration/nextjs#middleware
// // https://nextjs.org/docs/app/building-your-application/routing/middleware

// import NextAuth from 'next-auth';
// import authConfig from './auth.config';

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   if (!req.auth) {
//     const url = req.url.replace(req.nextUrl.pathname, '/');
//     return Response.redirect(url);
//   }
// });

// export const config = { matcher: ['/dashboard/:path*'] };


import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/(api|trpc)(.*)', // Run middleware on API routes
    '/dashboard/(.*)', // Protect all dashboard routes
  ],
};


