# AIToolsCenter Website

Single-page website built with React + Vite to help users discover, compare, and choose the best AI tools for writing, coding, design, video, automation, and research.

## What is included

- AI tools directory with categories and search
- Dedicated SEO routes for tools and categories
- Favorites, sorting, and side-by-side tool comparison
- Top 10 weekly ranked section
- Submit-your-tool form with validation and server-side delivery
- AI news section with external source links
- Educational section explaining how AI tools work
- FAQ and newsletter signup section
- Mobile-responsive layout
- Branded color and typography system
- SEO metadata, robots.txt, and sitemap.xml for indexing

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Key files

- `src/App.jsx`: page content and section structure
- `src/index.css`: global styles and responsive design
- `.github/copilot-instructions.md`: setup checklist and completion status

## Customization notes

- Update tool links, ratings, and categories in `src/App.jsx`.
- Add `VITE_AMAZON_ASSOCIATE_TAG` in `.env.local` (example: `aitoolscenter-21`) to automatically append your Amazon tag to any Amazon link in tool cards.
- For any tool/card, set `affiliateLink` in `TOOLS` when you want a custom tracking URL; otherwise `link` is used.
- Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel for form handling.
- Add affiliate links and a paid submit-your-tool flow for monetization.

## Facebook Ads Setup

1. Create a Meta Pixel in Meta Events Manager.
2. Set `VITE_META_PIXEL_ID` in Vercel Project Settings > Environment Variables.
3. Redeploy the project. The site will initialize Meta Pixel only when ad consent is granted.
4. In Meta Ads Manager, use this URL for campaigns: `https://www.aitoolscenter.in/`.
5. Create conversions in Events Manager for `PageView` and custom event `RouteView`.

Notes:
- Consent controls are wired to the existing cookie banner.
- CSP in `vercel.json` includes Meta Pixel domains (`connect.facebook.net`, `www.facebook.com`, `graph.facebook.com`).

## Toolkit PDF

- Source script: `scripts/generate-toolkit-pdf.mjs`
- Output file: `public/ai-workflow-kit.pdf`
- Regenerate the PDF anytime with:

```bash
npm run toolkit:pdf
```

## Newsletter Setup

- Copy `.env.example` to `.env`.
- Set `SUPABASE_URL` to your project URL from Supabase.
- Set `SUPABASE_SERVICE_ROLE_KEY` to the Supabase service role key in your Vercel project settings.
- The site posts to `/api/newsletter`, and the Python Vercel function writes to the `newsletter_submissions` table.
- To send confirmation email, set SMTP variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `NEWSLETTER_FROM_EMAIL`.
- Optional: set `SMTP_USE_TLS`, `NEWSLETTER_REPLY_TO_EMAIL`, and `SITE_URL`.
- Restart the dev server after changing environment variables locally.

## Submit Tool Setup

- Use the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables.
- The submit form posts JSON to `/api/submit-tool` and the Vercel function writes to `tool_submissions`.
- The payload includes name, URL, category, pricing, contact email, and description.

## Deployment

- Production URL: https://aitoolscenter.in/
- Vercel preview URL is generated per deployment in your Vercel dashboard.
- Deployments are managed by Vercel from the connected GitHub repository.

## Analytics

- Vercel Analytics dependency is not enabled in the current build.

## SEO

- Core SEO and social metadata are in `index.html`.
- `public/robots.txt` allows crawling and points to the sitemap.
- `public/sitemap.xml` includes the production domain URL.

## Releases

- Create a version tag and push it to trigger the release workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

- This creates a GitHub Release and uploads a `dist.zip` build artifact.

## Custom domain

- Set `aitoolscenter.in` as Primary in Vercel Domains.
- Use the exact DNS records shown in Vercel for `@` and `www`.
- Remove any old GitHub Pages DNS entries to avoid conflicts.
