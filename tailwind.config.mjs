/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lumen: {
          bg: '#0d0a08',
          surface: '#14110d',
          accent: '#f97316',
          fg: '#fafafa',
          'fg-muted': 'rgba(250, 250, 250, 0.55)',
          border: 'rgba(250, 250, 250, 0.12)',
          'border-strong': 'rgba(250, 250, 250, 0.18)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      borderRadius: {
        lumen: '16px',
        'lumen-sm': '8px',
      },
      maxWidth: {
        'lumen-container': '1200px',
      },
      transitionTimingFunction: {
        lumen: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
