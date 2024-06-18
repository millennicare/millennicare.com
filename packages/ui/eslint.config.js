import baseConfig from "@millennicare/eslint-config/base";
import reactConfig from "@millennicare/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
