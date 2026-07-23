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
### Lumen (wired into homepage)
- Changelog: `src/content/lumen-changelog/`
- Status: `src/content/lumen-status/current.yaml`

### Retained portfolio (unused on Lumen page)
- Bio, experiences, projects, hobbies, highlights, photos, testimonials under `src/content/`
- Assets: `public/photos/`, `public/logos/`, `public/projects/`

## Env (see `.env.example`)
- `PUBLIC_POSTHOG_PROJECT_TOKEN` / `PUBLIC_POSTHOG_HOST` — analytics
- `PUBLIC_FORMSPREE_FORM_ID` — waitlist form endpoint
