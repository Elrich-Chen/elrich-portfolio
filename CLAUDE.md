# CLAUDE.md – elrichchen.com Portfolio

## Project Overview
Personal developer portfolio for Elrich Chen, built with Astro 5 + TailwindCSS 3 + MDX.
Deployed at elrichchen.com.

## Tech Stack
- **Framework**: Astro 5 (`npm run dev` → localhost:4321)
- **Styling**: TailwindCSS 3, PostCSS, Autoprefixer
- **Content**: Astro Content Collections (MDX/Markdown)
- **Image optimization**: Sharp
- **Build**: `npm run build` → `./dist/`
- **Language**: TypeScript

## Project Structure
```
src/
  components/      # Astro UI components (HeroLoom, Nav, Polaroid, Prose, SideContact, Signature, ThemeToggle, PixelTrail, TargetCursor)
  content/         # Content collections
    bio/           # bio.md
    experiences/   # *.md  (role, company, url?, logo?, start, end?, bullets[])
    projects/      # *.md  (name, href?, logo?, year?, tags[], body)
    hobbies/       # *.md  (title, date, tags, summary, body)
    highlights/    # home.md (what_makes_me_different[], building[])
    photos/        # photo entries
    testimonials/  # testimonial entries
    config.ts      # Collection schemas
  layouts/         # Base.astro
  pages/           # index.astro, about.astro, projects.astro, photos.astro, hobbies/
  styles/          # Global CSS
  utils/           # Utility functions
public/
  logos/           # Company/project logos (PNG/SVG)
  photos/          # Photo assets
  projects/        # Project screenshots/assets
  Elrich_Chen_SoftwareDev_Resume-3.pdf
```

## Key Commands
| Command         | Action                          |
|-----------------|---------------------------------|
| `npm run dev`   | Dev server at localhost:4321    |
| `npm run build` | Production build to ./dist/     |
| `npm run preview` | Preview production build      |

## Content Editing
- **Bio**: `src/content/bio/bio.md`
- **Experiences**: `src/content/experiences/*.md` – fields: `role`, `company`, `url`, `logo`, `start`, `end`, `bullets`
- **Projects**: `src/content/projects/*.md` – fields: `name`, `href`, `logo`, `year`, `tags`, body
- **Hobbies**: `src/content/hobbies/*.md` – fields: `title`, `date`, `tags`, `summary`, body
- **Home highlights**: `src/content/highlights/home.md` – arrays: `what_makes_me_different`, `building`
- **Logos**: place in `public/logos/` and reference as `/logos/name.png`

## 🚫 FORBIDDEN PATTERNS (LESSONS LEARNED)
<!-- Add lessons here as they are learned -->

## Conventions
- Astro components use `.astro` extension; TypeScript utilities use `.ts`
- TailwindCSS utility classes preferred over custom CSS
- Content-driven pages use Astro content collections, not hardcoded data
- Images served from `public/` directory; reference with absolute paths (e.g. `/logos/x.png`)
- No React/Vue/Svelte – pure Astro components only
