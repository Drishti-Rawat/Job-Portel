
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = [
  '/',
  '/sign-in(.*)',  // This will match all routes under /sign-in
  '/sign-up(.*)' 
];

// const protectedRoutes = [
//   '/post-job(.*)',
//   '/my-jobs(.*)',
//   '/saved-jobs(.*)',
//   '/job-listing(.*)'
// ];

const isPublicRoute = createRouteMatcher(publicRoutes);
// const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionId, redirectToSignIn  } = await auth();
  // console.log(sessionId);

  if (!isPublicRoute(request)) {
    // If user is not authenticated, redirect to the sign-in page
    if (!userId || !sessionId) {
      return redirectToSignIn();
    }
  }

});

// will aslos check onbarding status
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', '/',
    '/(api|trpc)(.*)',
  ],
};