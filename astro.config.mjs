// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Holding page only while the site is rebuilt — old routes bounce home.
  redirects: {
    '/about': '/',
    '/projects': '/',
    '/photos': '/',
    '/hobbies': '/',
  },
  image: {
    // Enable sharp for image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      include: [
        'three',
        'three/addons/loaders/GLTFLoader.js',
        'gsap',
        'gsap/ScrollTrigger',
      ],
    },
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },
});
