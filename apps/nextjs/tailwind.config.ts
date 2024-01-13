import type { Config } from "tailwindcss";
import baseConfig from "@millennicare/tailwind-config";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", ...fontFamily.sans],
        mono: ["var(--font-quicksand)", ...fontFamily.mono],
      },
    },
  },
} satisfies Config;
