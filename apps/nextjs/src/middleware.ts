import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/eula",
    "/privacy-policy",
    "/contact-us",
    "/sign-in",
    "/sign-up",
    "/sign-up/careseeker",
    "/forgot-password",
    "/api/trpc/user.findDuplicateEmail",
    "/api/locations/get-suggestions",
    "/api/locations/get-details",
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
