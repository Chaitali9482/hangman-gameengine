# Hangman Game - Deployment Guide

## 📦 Build Information

**Production Build Output:**
- HTML: `index.html` (0.72 kB)
- CSS: `index-Dgj8OO6R.css` (23.14 kB gzipped: 5.11 kB)
- JavaScript: `index-Dw4AmW3N.js` (225.98 kB gzipped: 71.95 kB)
- Static Assets: `graduation-cap-B3LuVkO-.png` (31.23 kB)

**Build Location:** `apps/hangman-app/dist/`

---

## 🚀 Deployment Options

### 1. **Vercel (Recommended - Easiest)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Benefits:**
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available

---

### 2. **Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=apps/hangman-app/dist
```

**Benefits:**
- ✅ Simple drag-and-drop deployment
- ✅ Automatic builds from git
- ✅ Free tier generously amounts

---

### 3. **Docker Deployment**

```bash
# Build Docker image
docker build -t hangman-game:latest .

# Run container
docker run -p 3000:3000 hangman-game:latest

# Push to registry (optional)
docker tag hangman-game:latest your-registry/hangman-game:latest
docker push your-registry/hangman-game:latest
```

**Deploy to:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Heroku

---

### 4. **Traditional Web Server (Nginx/Apache)**

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name hangman.example.com;

    root /var/www/hangman-app/dist;
    index index.html;

    # SPA routing - all requests go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
    }

    # GZIP compression
    gzip on;
    gzip_types text/plain text/css text/javascript 
               application/javascript application/json;
}
```

---

### 5. **AWS S3 + CloudFront**

```bash
# Build the app
npm run nx -- build hangman-app

# Sync to S3
aws s3 sync apps/hangman-app/dist s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 🛠️ Pre-Deployment Checklist

### Performance
- ✅ Production build created (optimized bundles)
- ✅ CSS minified and extracted (5.11 kB gzipped)
- ✅ JavaScript tree-shaken and minified (71.95 kB gzipped)
- ✅ Assets fingerprinted for cache-busting

### Responsiveness
- ✅ Mobile-friendly (tested on multiple screen sizes)
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Works on all modern browsers
- ✅ Works on Safari, Chrome, Firefox, Edge

### SEO & Accessibility
- ✅ Proper viewport meta tags configured
- ✅ Semantic HTML structure
- ✅ Theme color set (`#0d1117`)
- ✅ PWA-ready meta tags

### Security
- ✅ No console errors or warnings in production build
- ✅ CSP-friendly (no inline scripts)
- ✅ No hardcoded secrets or API keys

---

## 📝 Build Scripts

Add to `package.json` if not present:

```json
{
  "scripts": {
    "build:prod": "nx build hangman-app --configuration production",
    "build:analyze": "nx build hangman-app -- --mode analyze",
    "serve:prod": "serve -s dist -l 4200"
  }
}
```

---

## 🔒 Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- `VITE_API_URL` - Backend API endpoint (if needed)
- `VITE_ENV` - Environment name (production/staging)
- `VITE_ANALYTICS_ID` - Tracking ID (optional)

---

## 📊 Performance Tips

### Enable Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Set Cache Headers
```nginx
# 1 year for versioned assets
location ~* \.(js|css)$ {
  expires 365d;
  add_header Cache-Control "public, immutable";
}

# 1 day for HTML
location ~* \.html$ {
  expires 1d;
  add_header Cache-Control "public, must-revalidate";
}
```

### Enable HTTP/2
```nginx
listen 443 ssl http2;
# ... SSL configuration ...
```

---

## ✅ Health Checks

Test deployment:

```bash
# Check if app loads
curl -I https://hangman.example.com

# Check if app is responsive
curl https://hangman.example.com | grep -o '<title>.*</title>'

# Monitor bundle size
# Should be < 250KB JS gzipped (currently 71.95 kB ✅)
```

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Hangman Game

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22.12.0'
      - run: npm ci
      - run: npm run nx -- build hangman-app
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Blank Page on Production
- Clear browser cache (`Ctrl+Shift+Delete`)
- Check CloudFront/CDN cache invalidation
- Verify `base href` in `index.html`

### SPA Routing Issues
- Ensure web server redirects all routes to `index.html`
- Check `.well-known/_redirects` file on Netlify

### CORS Errors
- Add CORS headers if backend is separate domain
- Use proxy in development (`vite.config.mts`)

### Large Bundle Size
- Run build analysis: `npm run build:analyze`
- Check for unused dependencies in `package.json`

---

## 📞 Support

For deployment issues:
1. Check build logs: `apps/hangman-app/dist/`
2. Review platform-specific documentation
3. Test locally with: `npm run serve:prod`
