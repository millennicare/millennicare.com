import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/eula",
    "/privacy-policy",
    "/contact-us",
    "/auth/login",
    "/auth/register",
    "/auth/register/careseeker",
    "/auth/forgot-password",
    "/api/trpc/user.findDuplicateEmail",
    "/api/locations/get-suggestions",
    "/api/locations/get-details",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
