# CLAUDE.md – Lumen

## Project Overview
Lumen marketing site (Astro 5 + TailwindCSS 3). Built from Kombai designs.
Legacy portfolio content and photos are retained under `src/content/` and `public/` for reuse.

## Tech Stack
- **Framework**: Astro 5 (`npm run dev` → localhost:4321)
- **Styling**: TailwindCSS 3 + `src/styles/lumen.css`
- **Motion**: GSAP + ScrollTrigger
- **Analytics**: PostHog
- **Build**: `npm run build` → `./dist/`

## Project Structure
```
src/
  components/lumen/   # Hero, Statement, Principles, ProductWindow, CTA
  components/posthog.astro
  content/            # Retained portfolio content collections
  layouts/LumenLayout.astro
  pages/index.astro   # Lumen landing page
  styles/lumen.css
public/
  photos/             # Photo assets
  logos/              # Logo assets
  projects/           # Project assets
.kombai/              # Kombai design canvas
```

## Key Commands
| Command | Action |
|-----------------|---------------------------------|
| `npm run dev` | Dev server at localhost:4321 |
| `npm run build` | Production build to ./dist/ |
| `npm run preview` | Preview production build |

## Content (retained)
- Bio: `src/content/bio/`
- Experiences: `src/content/experiences/`
- Projects: `src/content/projects/`
- Hobbies: `src/content/hobbies/`
- Highlights: `src/content/highlights/`
- Photos metadata: `src/content/photos/`
- Testimonials: `src/content/testimonials/`
- Assets: `public/photos/`, `public/logos/`, `public/projects/`
