/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(20, 20, 20)',
        muted: 'rgb(112, 112, 112)',
        background: 'rgb(250, 250, 250)',
      },
      maxWidth: {
        prose: '72ch',
      },
    },
  },
  plugins: [],
};


