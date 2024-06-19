import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import { hairlineWidth } from "nativewind/theme";

import baseConfig from "@millennicare/tailwind-config/native";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      borderWidth: {
        hairlineWidth: hairlineWidth(),
      },
    },
  },
} satisfies Config;
