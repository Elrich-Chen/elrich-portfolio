# Content Editing Guide

## How to Edit Your About Me Section

### 1. **Edit the Text Content**
The about me text is stored in: `src/content/bio/bio.md`

This is a markdown file that you can edit directly. Here's what you can change:

```markdown
---
title: About
updated: "2025-10-29"
---

Your intro paragraph here...

When I'm not coding, you'll find me...

## Education

**University Name** | Degree
*Year Range*

Relevant Coursework:
- Course 1
- Course 2
```

**To edit:** Simply open `src/content/bio/bio.md` and change any text you want!

### 2. **Change the Polaroid Photo**

The polaroid photo is configured in: `src/pages/about.astro`

Look for this section (around line 18-23):
```astro
<Polaroid 
  src="/photos/elrich_photos/profile.jpg" 
  alt="Elrich Chen" 
  caption="Building things & breaking code"
  rotation={-3}
/>
```

**To change the photo:**
1. Add your photo to `/public/photos/elrich_photos/`
2. Update the `src` path (e.g., `src="/photos/elrich_photos/your-photo.jpg"`)

**To change the caption:**
- Edit the `caption` text
- Example: `caption="Coffee enthusiast & code wizard"`

**To adjust the rotation:**
- Change the `rotation` number (negative = left tilt, positive = right tilt)
- Example: `rotation={2}` for a slight right tilt

### 3. **Customize the Polaroid Style**

You can customize how the polaroid looks by editing `src/components/Polaroid.astro`

Common customizations:
- **Size:** Change `max-width: 280px;` in the `.polaroid` style
- **Padding:** Adjust `padding: 12px 12px 45px 12px;` to change the white border
- **Shadow:** Modify the `box-shadow` values for different shadow effects

### 4. **Add Multiple Polaroids**

Want to add more photos? Just duplicate the Polaroid component:

```astro
<div class="polaroid-wrapper">
  <Polaroid 
    src="/photos/elrich_photos/photo1.jpg" 
    alt="Description 1" 
    caption="First photo"
    rotation={-3}
  />
  <Polaroid 
    src="/photos/elrich_photos/photo2.jpg" 
    alt="Description 2" 
    caption="Second photo"
    rotation={2}
  />
</div>
```

### 5. **Reposition the Polaroid**

The polaroid is currently on the left side. To change its position, edit the CSS in `src/pages/about.astro`:

**Move to the right:**
```css
.about-container {
  display: flex;
  gap: 2rem;
  align-items: start;
  flex-direction: row-reverse; /* Add this line */
}
```

**Center it above the text:**
```css
.about-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-direction: column; /* Change to column */
}
```

## Quick Reference: File Locations

| What to Edit | File Path |
|-------------|-----------|
| About me text | `src/content/bio/bio.md` |
| Polaroid photo/settings | `src/pages/about.astro` |
| Polaroid styling | `src/components/Polaroid.astro` |
| Page layout | `src/pages/about.astro` (CSS section) |

## Tips

- **Markdown formatting:** The bio content supports standard markdown (bold with `**text**`, links with `[text](url)`, etc.)
- **Photo formats:** Use `.jpg`, `.jpeg`, or `.png` for photos
- **Photo size:** Optimize photos to be under 1MB for faster loading
- **Caption font:** The caption uses the handwritten "Reenie Beanie" font for that authentic polaroid feel

## Need Help?

- Markdown guide: https://www.markdownguide.org/basic-syntax/
- Astro docs: https://docs.astro.build/

