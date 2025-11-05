# How to Add Photos to Your Portfolio

Your portfolio now has a beautiful polaroid-style photo gallery! Here's how to add your photos:

## Step 1: Add Your Photo Images

1. Place your photo images in the `/public/photos/` folder
2. Supported formats: JPG, PNG, WebP
3. Recommended size: 1200x900px or similar 4:3 aspect ratio

Example:
```
/public/photos/
  ├── vacation-2024.jpg
  ├── hackathon-win.jpg
  └── team-photo.jpg
```

## Step 2: Create a YAML File for Each Photo

For each photo, create a `.yaml` file in `/src/content/photos/`

### File naming:
- Use descriptive names: `vacation-2024.yaml`, `hackathon-win.yaml`
- Files will be displayed in alphabetical order

### YAML Format:

```yaml
image: "/photos/your-photo.jpg"
caption: "Your handwritten-style caption"
date: "Summer 2024"
location: "Toronto, ON"  # Optional
```

### Example 1 - With Location:
```yaml
image: "/photos/vacation-2024.jpg"
caption: "Best summer ever!"
date: "Aug 2024"
location: "Vancouver, BC"
```

### Example 2 - Without Location:
```yaml
image: "/photos/hackathon-win.jpg"
caption: "Won first place at HackTheValley"
date: "Fall 2024"
```

## Step 3: View Your Gallery

Navigate to `/photos` on your site to see your polaroid gallery!

## Features

- **Polaroid style**: White frame with subtle rotation
- **Handwritten captions**: Uses "Reenie Beanie" cursive font
- **Minimalist dates**: Small, clean date/location display
- **Hover effects**: Cards lift up and rotate slightly on hover
- **Responsive**: Works on mobile, tablet, and desktop (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Fast loading**: Lazy-loaded images

## Tips

- Keep captions short and sweet (3-8 words works best)
- Use consistent date formats ("Summer 2024", "Dec 2024", "Fall 2024")
- Location is optional - omit if not relevant
- Photos are sorted alphabetically by filename

## Quick Add Workflow

1. Drop photo in `/public/photos/my-photo.jpg`
2. Create `/src/content/photos/my-photo.yaml`:
   ```yaml
   image: "/photos/my-photo.jpg"
   caption: "Amazing moment"
   date: "Nov 2024"
   ```
3. Refresh your browser - done!

That's it! Your photo gallery is ready to fill with memories.
