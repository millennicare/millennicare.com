// /* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as authEnv } from "@millennicare/auth/env";

export const env = createEnv({
  extends: [authEnv],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    AWS_REGION: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_BUCKET: z.string(),
    AWS_LOCATION_API_KEY: z.string(),
    AWS_MAIL_ACCESS_KEY: z.string(),
    AWS_MAIL_SECRET_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    SYMMETRIC_KEY: z.string(),
    DATABASE_URL: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
