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
};

export default config;
