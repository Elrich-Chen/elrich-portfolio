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

- `src/pages/index.astro` — Lumen landing page
- `src/components/lumen/` — page sections (Hero → Statement → Principles → Product → Changelog → Status → CTA)
- `src/layouts/LumenLayout.astro` — site shell
- `src/content/lumen-changelog/` · `src/content/lumen-status/` — product updates (wired)
- `src/content/` — also retains unused portfolio collections
- `public/photos/` · `public/logos/` · `public/projects/` — retained assets
- `.kombai/` — Kombai design source

## Environment

Copy `.env.example` to `.env`:

- `PUBLIC_POSTHOG_*` — analytics (optional)
- `PUBLIC_FORMSPREE_FORM_ID` — waitlist backend (required for CTA submissions)
