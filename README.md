# AIToolsCenter Website

Single-page website built with React + Vite to help users discover, compare, and choose the best AI tools for writing, coding, design, video, automation, and research.

## What is included

- AI tools directory with categories and search
- Favorites, sorting, and side-by-side tool comparison
- Educational section explaining how AI tools work
- FAQ and newsletter signup section
- Mobile-responsive layout
- Branded color and typography system
- Vercel Analytics integration

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
- Replace newsletter form alert with a real email provider (Mailchimp, ConvertKit, or Beehiiv).
- Add affiliate links and a paid submit-your-tool flow for monetization.

## Deployment

- Vercel project URL: https://aitoolscenter-kappa.vercel.app/
- Custom domain: https://aitoolscenter.in/
- Deployments are managed by Vercel from the connected GitHub repository.

## Analytics

- Vercel Analytics is enabled in `src/main.jsx` using `@vercel/analytics/react`.
- In Vercel dashboard, open your project and enable Analytics for production insights.

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
