# Logo Setup Guide

## Adding the University of Waterloo Logo

I've added support for the UWaterloo logo. Here's how to add the actual logo file:

### Step 1: Save the Logo
1. Save the University of Waterloo logo image you provided
2. Name it: `uwaterloo.png`
3. Make sure it's a PNG file with a transparent background
4. Recommended size: 32x32px or 64x64px

### Step 2: Place in Public Folder
Put the logo file here:
```
/public/logos/uwaterloo.png
```

### Step 3: It Will Automatically Work
The logo will now appear wherever you use `[LOGO:UWaterloo]` in your content!

## Other Logos You Can Add

The system is ready for these logos too (just add the PNG files):

- `/public/logos/queens-compsa.png` - Queen's COMPSA logo
- `/public/logos/donemaker.png` - DoneMaker logo  
- `/public/logos/ontario-legal-tech.png` - Ontario Legal Tech logo
- `/public/logos/uoft.png` - University of Toronto logo

## Logo Guidelines

- **Format**: PNG with transparent background
- **Size**: 16-64px (they'll be displayed at 16px inline)
- **Naming**: lowercase with hyphens (e.g., `queens-compsa.png`)
- **Quality**: Use high-resolution images that scale down well

## Testing

After adding logos, they'll appear inline with text like this:
"Working at [LOGO:UWaterloo] on AI research"

The logos are clickable and link to the organization's website!

