import { fileURLToPath } from "url";
import _jiti from "jiti";

const jiti = _jiti(fileURLToPath(import.meta.url));

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
jiti("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  // output: "standalone",
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@millennicare/api",
    "@millennicare/auth",
    "@millennicare/db",
    "@millennicare/lib",
    "@millennicare/ui",
    "@millennicare/validators",
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
};

export default config;
