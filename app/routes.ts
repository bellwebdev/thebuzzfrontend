import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("layouts/app.tsx", [
    index("routes/feed.tsx"),
    // Public hive browsing (client-fetched; see loader comments in the modules).
    route("hives", "routes/hives.tsx"),
    route("hives/:slug", "routes/hive.tsx"),
  ]),
  route("auth", "routes/auth.tsx"),
] satisfies RouteConfig;
