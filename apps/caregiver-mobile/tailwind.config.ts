import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@millennicare/tailwind-config/native";

const { hairlineWidth } = require("nativewind/theme");

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      borderWidth: {
        hairlineWidth: hairlineWidth(),
      },
    },
  },
} satisfies Config;
