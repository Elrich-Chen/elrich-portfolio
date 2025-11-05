# How to Add Company Logos

## Quick Guide

### Step 1: Get Your Logo
- Download the company logo as a PNG file
- Resize it to 16x16 or 20x20 pixels (small size, transparent background preferred)
- Save it with a descriptive filename (lowercase, use hyphens for spaces)

### Step 2: Place Logo File
Put your logo in the `/public/logos/` folder:
```
/public/logos/
  ├── ontario-legal-tech.png
  ├── queens-compsa.png
  ├── done-maker.png
  └── [your-company-name].png
```

### Step 3: Use in Content
In `src/content/highlights/home.md`, add `[LOGO:Company Name]` where you want the logo to appear:

**Example:**
```yaml
what_makes_me_different:
  - "Enabled lawyers to process cases efficiently using [LOGO:Ontario Legal Tech] TypeScript, Next.js"
  - "Improved access for 2000+ members using [LOGO:Queen's COMPSA] Figma and TailwindCSS"
```

**Important:**
- The company name in brackets should match your filename (case-insensitive, spaces become hyphens)
- `[LOGO:Ontario Legal Tech]` → looks for `/logos/ontario-legal-tech.png`
- `[LOGO:Queen's COMPSA]` → looks for `/logos/queen's-compsa.png`
- If logo doesn't exist, it will be hidden automatically

### Step 4: With Sub-points Format
You can also use logos in the detailed format:

```yaml
what_makes_me_different:
  - point: "Worked at [LOGO:Ontario Legal Tech] on legal tools"
    details:
      - "Enabled lawyers using TypeScript, Next.js"
      - "Improved team with documentation for 2 tools"
```

### Tips
- Use PNG format with transparent background
- Keep logos small (16-20px) for inline display
- Name files consistently (lowercase, hyphens for spaces)
- Logos appear inline with text and scale on hover

