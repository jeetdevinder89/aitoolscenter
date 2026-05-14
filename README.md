# AIToolsCenter Website

[![Deploy to GitHub Pages](https://github.com/jeetdevinder89/aitoolscenter/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeetdevinder89/aitoolscenter/actions/workflows/deploy.yml)

Single-page website built with React + Vite to help users discover, compare, and choose the best AI tools for writing, coding, design, video, automation, and research.

## What is included

- AI tools directory with categories and search
- Educational section explaining how AI tools work
- FAQ and newsletter signup section
- Mobile-responsive layout
- Branded color and typography system

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

- Live site: https://jeetdevinder89.github.io/aitoolscenter/
- GitHub Pages deploys automatically from `main` via `.github/workflows/deploy.yml`.

## Releases

- Create a version tag and push it to trigger the release workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

- This creates a GitHub Release and uploads a `dist.zip` build artifact.

## Custom domain

- Configured domain: https://aitoolscenter.in/
- The `public/CNAME` file is set to `aitoolscenter.in`.
- In GitHub Pages settings, keep Source as `GitHub Actions` and set the custom domain to `aitoolscenter.in`.
