# The Buzz Frontend

React + Vite + SSG app for [Cloudflare Pages](https://pages.cloudflare.com/), with static pre-rendering via [React Router](https://reactrouter.com/).

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **React Router 7** (framework mode, `ssr: false` + pre-render)
- Static export → `build/client`

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Pre-render static site to `build/client` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Generate route types and run TypeScript |

## Project structure

```
app/
  components/   # Post, Posts, Event, Events
  lib/          # API client
  routes/       # Page routes
  types/        # Shared TypeScript types
public/         # Static assets + Cloudflare _redirects
```

## Cloudflare Pages

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `build/client` |
| Environment variable | `VITE_API_URL` |

`public/_redirects` provides SPA fallback for routes not listed in `react-router.config.ts` `prerender`.

## Adding routes

1. Create a route file under `app/routes/`.
2. Register it in `app/routes.ts`.
3. Add the path to `prerender` in `react-router.config.ts` if it should be statically generated.
