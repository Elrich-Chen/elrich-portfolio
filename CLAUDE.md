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

## Content
### Lumen page
Ported from Kombai inspiration (`tmp-lumen-ref` / `.kombai/canvas/Lumen.canvas`). Sections: Hero → Statement → Principles → ProductWindow → CTA. Motion is vanilla scroll choreography (not GSAP). Contact form posts to Formspree.

### Retained (unused on Lumen page)
- Portfolio collections under `src/content/` (including unused `lumen-changelog` / `lumen-status`)
- Assets: `public/photos/`, `public/logos/`, `public/projects/`

## Env (see `.env.example`)
- `PUBLIC_POSTHOG_PROJECT_TOKEN` / `PUBLIC_POSTHOG_HOST` — analytics
- Contact form — Formspree endpoint hardcoded in `CTA.astro`
