# 🚀 Deployment Guide

This guide provides comprehensive instructions for deploying your Data Science Portfolio to GitHub Pages and other hosting platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Custom Domain Setup](#custom-domain-setup)
- [Alternative Hosting Options](#alternative-hosting-options)
- [Build Optimization](#build-optimization)
- [Troubleshooting](#troubleshooting)
- [Performance Monitoring](#performance-monitoring)

## 🔧 Prerequisites

Before deploying, ensure you have:

- [x] Git installed and configured
- [x] GitHub account created
- [x] Repository created (preferably named `[username].github.io`)
- [x] All placeholder content updated with your information
- [x] Profile photo added to `assets/images/profile.jpg`
- [x] Project data updated in `js/components/projects.js`

### Pre-deployment Checklist

```bash
# 1. Test locally
python -m http.server 8000
# Visit http://localhost:8000 and test all functionality

# 2. Run tests (if available)
open test/responsive-test.html
# Check responsive design across devices

# 3. Validate HTML
# Use https://validator.w3.org/ to validate your HTML

# 4. Check accessibility
# Use browser dev tools or online accessibility checkers

# 5. Optimize images
# Ensure all images are compressed and properly sized
```

## 🌐 GitHub Pages Deployment

### Method 1: Automatic Deployment (Recommended)

GitHub Actions will automatically build and deploy your site on every push to the main branch.

#### Step 1: Repository Setup

```bash
# Clone your repository
git clone https://github.com/[username]/[username].github.io.git
cd [username].github.io

# Add your files
git add .
git commit -m "Initial portfolio website"
git push origin main
```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment workflow will run automatically

#### Step 3: Verify Deployment

- Check the **Actions** tab for deployment status
- Visit `https://[username].github.io` once deployment completes
- Monitor the deployment logs for any issues

### Method 2: Manual Deployment

If you prefer manual control over the deployment process:

#### Step 1: Build Optimization

```bash
# Run the deployment script
./deploy.sh

# Or manually optimize
mkdir build
cat css/*.css > build/styles.css
cleancss -o build/styles.min.css build/styles.css
# ... (see deploy.sh for complete process)
```

#### Step 2: Deploy to GitHub Pages

```bash
# Option A: Deploy from main branch
git add .
git commit -m "Deploy optimized website"
git push origin main

# Option B: Deploy from gh-pages branch
git checkout -b gh-pages
cp -r build/* .
git add .
git commit -m "Deploy to gh-pages"
git push origin gh-pages
```

#### Step 3: Configure GitHub Pages

1. Go to **Settings** → **Pages**
2. Select source branch (`main` or `gh-pages`)
3. Select folder (`/ (root)` or `/docs`)
4. Save settings

## 🌍 Custom Domain Setup

### Step 1: Domain Configuration

1. **Purchase a domain** from a registrar (GoDaddy, Namecheap, etc.)

2. **Add CNAME file** to your repository:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

### Step 2: DNS Configuration

#### For Apex Domain (yourdomain.com)

Add these A records to your DNS:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### For Subdomain (www.yourdomain.com)

Add this CNAME record:
```
Type: CNAME
Name: www
Value: [username].github.io
```

### Step 3: Enable HTTPS

1. Go to **Settings** → **Pages**
2. Check **Enforce HTTPS**
3. Wait for SSL certificate provisioning (may take up to 24 hours)

## 🏗️ Alternative Hosting Options

### Netlify

1. **Connect repository:**
   - Sign up at [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build` (if using build process)
   - Set publish directory: `build` or `/`

2. **Configure build settings:**
   ```toml
   # netlify.toml
   [build]
     command = "./deploy.sh"
     publish = "build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
   ```

### Vercel

1. **Deploy with Vercel:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Configure vercel.json:**
   ```json
   {
     "buildCommand": "./deploy.sh",
     "outputDirectory": "build",
     "framework": null,
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

### Firebase Hosting

1. **Setup Firebase:**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Configure firebase.json:**
   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

3. **Deploy:**
   ```bash
   firebase deploy
   ```

## ⚡ Build Optimization

### Automated Optimization

The `deploy.sh` script automatically:

- ✅ Combines and minifies CSS files
- ✅ Combines and minifies JavaScript files
- ✅ Minifies HTML
- ✅ Optimizes images
- ✅ Generates sitemap.xml
- ✅ Creates robots.txt
- ✅ Adds .nojekyll file for GitHub Pages

### Manual Optimization

```bash
# CSS Optimization
cat css/*.css > combined.css
cleancss -o styles.min.css combined.css

# JavaScript Optimization
cat js/main.js js/components/*.js > combined.js
terser combined.js -o scripts.min.js --compress --mangle

# HTML Optimization
html-minifier-terser --collapse-whitespace --remove-comments \
  --minify-css --minify-js -o index.min.html index.html

# Image Optimization
# Use tools like imagemin, squoosh, or online compressors
```

### Performance Checklist

- [ ] **CSS**: Combined and minified
- [ ] **JavaScript**: Combined and minified
- [ ] **HTML**: Minified and optimized
- [ ] **Images**: Compressed and properly sized
- [ ] **Fonts**: Optimized loading with font-display: swap
- [ ] **Service Worker**: Implemented for caching
- [ ] **Lazy Loading**: Images load on scroll
- [ ] **Critical CSS**: Above-the-fold styles inlined

## 🔧 Troubleshooting

### Common Issues

#### 1. Site Not Loading

**Problem**: `https://[username].github.io` shows 404 error

**Solutions**:
```bash
# Check repository name
# Must be exactly: [username].github.io

# Check main branch
git branch -a
git checkout main

# Check GitHub Pages settings
# Settings → Pages → Source should be correct
```

#### 2. CSS/JS Not Loading

**Problem**: Styles or scripts not applying

**Solutions**:
```bash
# Check file paths in HTML
# Ensure paths are relative, not absolute

# Check for typos in filenames
ls -la css/ js/

# Clear browser cache
# Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

#### 3. Images Not Displaying

**Problem**: Images showing broken links

**Solutions**:
```bash
# Check image paths
ls -la assets/images/

# Verify image formats
# Use common formats: .jpg, .png, .webp, .svg

# Check file sizes
# GitHub has 100MB file limit
```

#### 4. Custom Domain Issues

**Problem**: Custom domain not working

**Solutions**:
```bash
# Check CNAME file
cat CNAME
# Should contain only your domain name

# Verify DNS settings
nslookup yourdomain.com
dig yourdomain.com

# Wait for DNS propagation (up to 48 hours)
```

#### 5. Build Failures

**Problem**: GitHub Actions failing

**Solutions**:
```bash
# Check workflow logs in Actions tab
# Look for specific error messages

# Validate YAML syntax
# Use online YAML validators

# Test build locally
./deploy.sh
```

### Debug Commands

```bash
# Check Git status
git status
git log --oneline -5

# Test local server
python -m http.server 8000
# or
npx serve .

# Validate HTML
curl -s "https://validator.w3.org/nu/?doc=https://[username].github.io"

# Check page speed
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://[username].github.io"
```

## 📊 Performance Monitoring

### Lighthouse Audits

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://[username].github.io --view

# Generate report
lighthouse https://[username].github.io --output html --output-path ./lighthouse-report.html
```

### Core Web Vitals

Monitor these metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Analytics Setup

#### Google Analytics 4

1. **Create GA4 property** at [analytics.google.com](https://analytics.google.com)

2. **Add tracking code** to `index.html`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

#### GitHub Pages Analytics

Monitor deployment metrics:

- **Build times**: Check Actions tab
- **Traffic**: Repository Insights → Traffic
- **Performance**: Use Lighthouse CI

### Monitoring Tools

- **Uptime**: [UptimeRobot](https://uptimerobot.com/)
- **Performance**: [GTmetrix](https://gtmetrix.com/)
- **SEO**: [Google Search Console](https://search.google.com/search-console)
- **Accessibility**: [WAVE](https://wave.webaim.org/)

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] **Test all functionality** on live site
- [ ] **Verify responsive design** on multiple devices
- [ ] **Check all links** and ensure they work
- [ ] **Test contact form** submission
- [ ] **Validate HTML/CSS** using online validators
- [ ] **Run accessibility audit** using WAVE or similar tools
- [ ] **Check page speed** using PageSpeed Insights
- [ ] **Submit sitemap** to Google Search Console
- [ ] **Set up monitoring** for uptime and performance
- [ ] **Share your portfolio** on social media and professional networks

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review GitHub Pages documentation**
3. **Search GitHub Issues** for similar problems
4. **Create an issue** in the repository with:
   - Detailed problem description
   - Steps to reproduce
   - Browser and OS information
   - Screenshots if applicable

---

**Happy deploying! 🚀**

*Your portfolio website will be live and accessible to the world, showcasing your data science expertise and professional achievements.*