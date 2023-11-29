import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  beforeAuth: () => {
    const res = NextResponse.next();

    // add the CORS headers to the response
    res.headers.append("Access-Control-Allow-Credentials", "true");
    res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
    res.headers.append(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT",
    );
    res.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );

    return res;
  },
  publicRoutes: [
    "/api/(.*)",
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
    "/api/trpc/contactUs.sendMessage",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
