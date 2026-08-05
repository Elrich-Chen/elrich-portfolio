# Lumen

AI desktop companion marketing site — Astro + Tailwind + GSAP.

## Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview production build |

## Structure

- `src/pages/index.astro` — Lumen landing (Kombai inspiration port)
- `src/components/lumen/` — Hero → Statement → Principles → Product → CTA
- `src/layouts/LumenLayout.astro` — site shell + nav
- `src/styles/lumen.css` — design CSS from Kombai source
- `src/content/` — retained collections (not used on homepage)
- `public/photos/` · `public/logos/` · `public/projects/` — retained assets
- `.kombai/` — Kombai design source

## Environment

Copy `.env.example` to `.env`:

- `PUBLIC_POSTHOG_*` — analytics (optional)
- Contact form — Formspree (`CTA.astro`)
