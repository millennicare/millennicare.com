// Importing env files here to validate on build
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@millennicare/api",
    "@millennicare/db",
    "@millennicare/ui",
    "@millennicare/validators",
    "@millennicare/lib",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
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
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
};

export default config;
