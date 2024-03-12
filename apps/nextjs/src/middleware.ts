import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default withClerkMiddleware((_req: NextRequest) => {
//   return NextResponse.next();
// });
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/api",
    "/api/:path/:trpc",
  ],
  afterAuth(auth, req) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl.href);
    }
  },
});

// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     *
     * This includes images, and requests from TRPC.
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};
