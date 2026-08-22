# Cardon Digital

Source for [cardondigital.com](https://cardondigital.com), the Cardon Digital
marketing site.

## Stack

- [Next.js 14](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- Deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000. No environment variables are needed for
local development.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the project |

## Layout

```
app/            routes, per route CSS, sitemap and robots
  industries/   sector pages (clinics, construction, hiring, restaurants, winery)
  work/         case studies
components/     shared and per page components
public/         static assets
middleware.ts   pre-launch holding page gate (COMING_SOON)
```

## Pre-launch gate

`middleware.ts` serves a holding page on every route with a `noindex` header
while `COMING_SOON=1` is set on the Vercel production environment. Preview
deployments do not set it and serve the full site.

## License

All rights reserved. The code and content in this repository are published for
reference and are not licensed for reuse.
