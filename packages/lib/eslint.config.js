import baseConfig from "@millennicare/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
    },
    ignores: ["dist/**"],
  },
  ...baseConfig,
];
