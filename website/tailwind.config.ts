import { heroui } from '@heroui/theme';

const tailwindConfig = {
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
};

export default tailwindConfig;
