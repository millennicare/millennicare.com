import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  afterAuth(auth, req) {
    const path = req.nextUrl.pathname;
    if (!auth.userId && !auth.isPublicRoute && path !== "sign-in") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  },
  publicRoutes: [
    "/api/(.*)",
    "/",
    "/eula",
    "/privacy-policy",
    "/contact-us",
    "/forgot-password",
    "/sign-up/careseeker",
    "/sign-up/caregiver",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
