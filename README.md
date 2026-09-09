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

## Environment flags

Two variables decide what production serves. Neither is needed for local
development, and neither is read in the browser, so both are plain Vercel
project environment variables and a change to either needs a redeploy to take
effect on an existing deployment.

| Variable | Set to | What it does |
| --- | --- | --- |
| `COMING_SOON` | `1` | Every route serves the holding page with a `noindex` header, in both locales. Unset it to serve the site. |
| `SHOWCASE` | `1` | The home route serves the temporary showcase. Unset it to serve the official home. |

### Pre-launch gate

`middleware.ts` serves a holding page on every route with a `noindex` header
while `COMING_SOON=1` is set on the Vercel production environment. Preview
deployments do not set it and serve the full site. The matcher excludes
anything with a file extension, so files under `public/` (the brand SVGs, the
OG image) are never gated by it; a deployment built before that exclusion
existed did gate them, which is one more reason a gate change is a redeploy.

### Temporary home swap

`SHOWCASE=1` makes the home route render the showcase in
`components/pages/showcase/`: the three modules, a demo button per module, how
pricing works, and the diagnostic. With the variable unset, or set to anything
other than `1`, the same route renders the official home exactly as before.

The official home is not deleted, moved or copied anywhere. It is the
`OfficialHome` function in `app/[locale]/page.tsx`, under the one switch that
reads the flag (`components/pages/showcase/flag.ts`), with its dictionary,
its metadata and its visuals all where they were. Bringing it back is
therefore: unset `SHOWCASE` on the Vercel production environment and redeploy.
Retiring the showcase for good is a second, separate commit that deletes
`components/pages/showcase/`, `lib/i18n/showcase.ts`, the switch, and the
showcase block appended at the end of `app/[locale]/home.css`.

## License

All rights reserved. The code and content in this repository are published for
reference and are not licensed for reuse.
