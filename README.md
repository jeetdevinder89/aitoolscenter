# AIToolsCenter Website

Single-page website built with React + Vite to help users discover, compare, and choose the best AI tools for writing, coding, design, video, automation, and research.

## What is included

- AI tools directory with categories and search
- Dedicated SEO routes for tools, categories, use-cases, and comparisons
- Favorites, sorting, and side-by-side tool comparison
- Top 10 weekly ranked section
- Trending leaderboard based on click analytics
- Internal linking hub for discovery and crawl depth
- Submit-your-tool form with validation and server-side delivery
- AI news section with external source links
- Educational section explaining how AI tools work
- FAQ and newsletter signup section
- Mobile-responsive layout
- Branded color and typography system
- SEO metadata, robots.txt, and sitemap.xml for indexing
- Route-aware Open Graph/Twitter metadata and JSON-LD structured data

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

The build now runs link validation, social card generation, sitemap generation, and then the Vite production build.

## Key files

- `src/App.jsx`: page content and section structure
- `src/index.css`: global styles and responsive design
- `scripts/validate-links.mjs`: validates internal anchors and outbound URL structure
- `scripts/check-external-links.mjs`: checks external link uptime and writes a health report
- `scripts/generate-social-cards.mjs`: generates premium Open Graph social cards under `public/social/`
- `.github/copilot-instructions.md`: setup checklist and completion status

## Customization notes

- Update tool links, ratings, and categories in `src/App.jsx`.
- Add `VITE_AMAZON_ASSOCIATE_TAG` in `.env.local` (example: `aitoolscenter-21`) to automatically append your Amazon tag to any Amazon link in tool cards.
- Configure affiliate URLs in `.env.local` or Vercel with variables such as `VITE_AFFILIATE_COPILOT`, `VITE_AFFILIATE_CURSOR`, `VITE_AFFILIATE_TABNINE`, `VITE_AFFILIATE_PERPLEXITY`, `VITE_AFFILIATE_RUNWAY`, `VITE_AFFILIATE_NOTION`, `VITE_AFFILIATE_ZAPIER`, `VITE_AFFILIATE_MAKE`, `VITE_AFFILIATE_JASPER`, `VITE_AFFILIATE_COPYAI`, `VITE_AFFILIATE_GRAMMARLY`, and `VITE_AFFILIATE_WRITESONIC`.
- For any tool/card, set `affiliateLink` in `TOOLS` when you want a custom tracking URL; otherwise the site falls back to the normal tool URL.
- Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel for form handling.
- The site includes a dedicated Affiliate Disclosure page, visible on-page disclosure messaging, and `rel="sponsored nofollow"` handling for affiliate-ready links.

## Affiliate setup

1. Join the affiliate programs you want to promote.
2. Add the approved tracking URLs to your environment variables locally and in Vercel.
3. Redeploy so the production bundle picks up the new affiliate URLs.
4. Review the live Affiliate Disclosure, footer disclosure, and tool-card labels after deployment.
5. Only add affiliate links for programs that allow your traffic sources and disclosure model.

## Facebook Ads Setup

1. Create a Meta Pixel in Meta Events Manager.
2. Set `VITE_META_PIXEL_ID` in Vercel Project Settings > Environment Variables.
3. Redeploy the project. The site will initialize Meta Pixel only when ad consent is granted.
4. In Meta Ads Manager, use this URL for campaigns: `https://www.aitoolscenter.in/`.
5. Create conversions in Events Manager for `PageView` and custom event `RouteView`.
6. Optional: set `VITE_ENABLE_FACEBOOK_AD_PLACEHOLDERS=true` to show visible Facebook ad slots on the homepage while integrating campaign embeds.

Notes:
- Consent controls are wired to the existing cookie banner.
- CSP in `vercel.json` includes Meta Pixel domains (`connect.facebook.net`, `www.facebook.com`, `graph.facebook.com`).

## CMP Setup (AdSense EEA/UK/CH)

To improve AdSense approval readiness in regulated regions, connect a certified IAB TCF v2 CMP:

1. Add your CMP loader script URL in environment variables:
	- `VITE_CMP_SCRIPT_URL=https://your-cmp-provider/loader.js`
2. Redeploy the site so the app can load the CMP script.
3. Verify your CMP exposes `window.__tcfapi` and captures consent choices.
4. The app automatically maps TCF consent to Google Consent Mode updates (`gtag('consent', 'update', ...)`).
5. When a CMP is detected, the built-in local cookie banner is suppressed to avoid dual consent prompts.

If no CMP is configured, the built-in local consent banner remains active.

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

## Link Monitoring

- Run `npm run links:uptime` to check external link health (tools, overrides, news links).
- Results are written to `reports/external-link-uptime.json`.
- Use `npm run links:uptime:strict` to fail CI/deployment if any link is unreachable.

## Custom domain

- Set `aitoolscenter.in` as Primary in Vercel Domains.
- Use the exact DNS records shown in Vercel for `@` and `www`.
- Remove any old GitHub Pages DNS entries to avoid conflicts.
