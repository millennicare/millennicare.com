/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:@next/next/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "jsx-a11y/heading-has-content": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
  },
};

module.exports = config;
