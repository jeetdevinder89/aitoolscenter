# AIToolsCenter Website

Single-page website built with React + Vite to help users discover, compare, and choose the best AI tools for writing, coding, design, video, automation, and research.

## What is included

- AI tools directory with categories and search
- Favorites, sorting, and side-by-side tool comparison
- Submit-your-tool form with validation and server-side delivery
- Educational section explaining how AI tools work
- FAQ and newsletter signup section
- Mobile-responsive layout
- Branded color and typography system
- Vercel Analytics integration
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
- Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel for form handling.
- Add affiliate links and a paid submit-your-tool flow for monetization.

## Newsletter Setup

- Copy `.env.example` to `.env`.
- Set `SUPABASE_URL` to your project URL from Supabase.
- Set `SUPABASE_SERVICE_ROLE_KEY` to the Supabase service role key in your Vercel project settings.
- The site posts to `/api/newsletter`, and the Vercel function writes to the `newsletter_submissions` table.
- Restart the dev server after changing environment variables locally.

## Submit Tool Setup

- Use the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables.
- The submit form posts JSON to `/api/submit-tool` and the Vercel function writes to `tool_submissions`.
- The payload includes name, URL, category, pricing, contact email, and description.

## Deployment

- Vercel project URL: https://aitoolscenter-kappa.vercel.app/
- Custom domain: https://aitoolscenter.in/
- Deployments are managed by Vercel from the connected GitHub repository.

## Analytics

- Vercel Analytics is enabled in `src/main.jsx` using `@vercel/analytics/react`.
- In Vercel dashboard, open your project and enable Analytics for production insights.

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
