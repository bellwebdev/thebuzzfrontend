import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("layouts/app.tsx", [
    index("routes/feed.tsx"),
    // Public hive browsing (client-fetched; see loader comments in the modules).
    route("hives", "routes/hives.tsx"),
    route("hives/:slug", "routes/hive.tsx"),
    // Public profile pages (client-fetched; see loader comment in the module).
    route("u/:username", "routes/profile.tsx"),
  ]),
  route("auth", "routes/auth.tsx"),
] satisfies RouteConfig;
