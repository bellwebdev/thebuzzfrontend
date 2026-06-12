import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("layouts/app.tsx", [index("routes/feed.tsx")]),
  route("auth", "routes/auth.tsx"),
] satisfies RouteConfig;
