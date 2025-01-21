import { heroui } from "@heroui/theme";
import type { Config } from 'tailwindcss';

export default {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './utilities/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: '#96153a',
          },
        },
        dark: {
          // Not using FightCore colors for dark right now due to contrast issue.
          colors: {
            primary: '#ef4444',
            background: '#030712',
          },
        },
      },
    }),
  ],
} satisfies Config;
