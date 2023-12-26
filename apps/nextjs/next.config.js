import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@millennicare/api",
    "@millennicare/db",
    "@millennicare/lib",
  ],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.NODE_ENV === "development"
            ? "millennicare-dev.s3.us-east-1.amazonaws.com"
            : "millennicare-app-files.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default config;
