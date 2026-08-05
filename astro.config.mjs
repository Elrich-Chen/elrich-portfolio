// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'three'],
    },
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },
});
