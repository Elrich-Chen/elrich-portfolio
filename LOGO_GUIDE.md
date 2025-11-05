# How to Add Company Logos

## Step 1: Prepare Your Logo Image
1. Get the company logo as a PNG file (transparent background preferred)
2. Resize it to approximately 16x16 pixels (or 20x20 for better quality on retina displays)
3. Save it with a descriptive filename

## Step 2: Place Logo in Public Folder
Place your logo file in the `/public/logos/` directory:
```
/public/logos/
  ├── ontario-legal-tech.png
  ├── queens-compsa.png
  ├── done-maker.png
  └── ... (other logos)
```

## Step 3: Use in Your Content
In your `src/content/highlights/home.md` file, use the `[LOGO:Company Name]` syntax where you want the logo to appear:

**Example:**
```markdown
what_makes_me_different:
  - "Enabled lawyers to process cases efficiently using [LOGO:Ontario Legal Tech] TypeScript, Next.js to engineer legal software tools."
  - "Improved access to governance resources for 2000+ members using [LOGO:Queen's COMPSA] Figma and TailwindCSS."
```

**Important Notes:**
- Company name in brackets should match the filename (case-insensitive, spaces will be converted to hyphens)
- Example: `[LOGO:Ontario Legal Tech]` will look for `/logos/ontario-legal-tech.png`
- If the logo file doesn't exist, it will be hidden automatically
- Logos appear inline with the text at 16px size

## Format with Sub-points
You can also use logos in the new format with main points and sub-points:

```yaml
what_makes_me_different:
  - point: "Worked on legal software tools at [LOGO:Ontario Legal Tech]"
    details:
      - "Enabled lawyers to process cases using TypeScript, Next.js"
      - "Improved team effectiveness by writing documentation for 2 tools"
      - "Applied UI/UX principles to redesign homepage"
```

The logo will appear next to the company name in both the main point and sub-points.

