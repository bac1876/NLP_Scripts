# Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `nlp-scripts-viewer` (or any name you prefer)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Link your local repository to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nlp-scripts-viewer.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository `nlp-scripts-viewer`
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project and deploy.

## Step 3: Test Your Application

1. Visit your deployed URL
2. Try the voice search (click the microphone icon)
3. Try text search by typing script names
4. Click on a script to view the PDF

## Troubleshooting

### Voice Search Not Working
- Voice search requires HTTPS (Vercel provides this automatically)
- Use Chrome, Edge, or Safari (Firefox doesn't support Web Speech API well)
- Allow microphone permissions when prompted

### PDFs Not Loading
- Ensure all PDF files are in the `public/scripts` folder
- Check that files are committed to Git and pushed to GitHub
- Vercel will automatically deploy the PDFs with your app

### Build Errors
- Run `npm install` locally first
- Test the build locally: `npm run build`
- Check Vercel build logs for specific errors

## Adding More Scripts

1. Add PDF files to `public/scripts/` folder
2. Commit and push to GitHub:
   ```bash
   git add public/scripts/*.pdf
   git commit -m "Add new scripts"
   git push
   ```
3. Vercel will automatically redeploy with the new scripts

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Help: https://docs.github.com
