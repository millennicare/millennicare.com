import baseConfig, {
  restrictEnvAccess,
} from "@millennicare/eslint-config/base";
import nextjsConfig from "@millennicare/eslint-config/nextjs";
import reactConfig from "@millennicare/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
