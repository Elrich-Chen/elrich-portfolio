# Deployment Instructions for Vercel

## Step 1: Push to GitHub

After creating your GitHub repository, run these commands:

```bash
# Add your GitHub repo as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/elrich-portfolio.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Import your `elrich-portfolio` repository
4. Vercel will auto-detect it's an Astro project
5. Click "Deploy" (no configuration needed!)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Vercel Configuration (Auto-detected)

Vercel will automatically detect:
- **Framework**: Astro
- **Build Command**: `pnpm build` (or `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `pnpm install` (or `npm install`)

No additional configuration needed! ✅

## Environment Variables (if needed later)

If you need environment variables:
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add your variables
4. Redeploy

## Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic production deployment
- Pull requests = automatic preview deployments

## Useful Commands

```bash
# Check git status
git status

# Add and commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub (triggers Vercel deployment)
git push

# View deployment logs
vercel logs
```

## Your Portfolio Features

✅ Pixel Trail effect
✅ Polaroid photo component
✅ Projects showcase
✅ Photos gallery
✅ Hobbies section
✅ Responsive design
✅ Fast loading with Astro

Enjoy your new portfolio! 🎉

