# React SSG App Standards

Conventions for this codebase: a React Router v7 app built in SSG mode (`ssr: false`),
exported as static HTML and hosted on Cloudflare Pages, talking to a separate FastAPI
backend on Digital Ocean. No Next.js — see "Why no Next.js" below.

---

## 1. Project Structure

```
app/
  routes/           # One file per route, registered in routes.ts. Thin: wiring only.
  components/       # Reusable UI. One folder per component:
                     #   ComponentName/
                     #     ComponentName.tsx
                     #     ComponentName.module.css
  layouts/          # Shared layout shells (nav, sidebars) wrapping route groups.
  hooks/            # Reusable stateful logic (use*.ts). No JSX here.
  lib/              # Framework-agnostic logic: api client, auth helpers, utils.
                     # Pure functions and side-effect wrappers, no React imports.
  data/             # Static/build-time data and data-shaping helpers for loaders.
  types/            # Shared TypeScript types/interfaces, grouped by domain
                     # (auth.ts, posts.ts, ...), re-exported from index.ts.
  root.tsx          # App shell: <html>, providers, error boundary.
  routes.ts         # Route table (path -> route module mapping).
  app.css           # Global styles.
public/              # Static assets copied as-is (favicon, redirects, etc).
```

**Rules:**

- A file does one job. A route file (`app/routes/feed.tsx`) owns routing concerns
  (loaders, meta, params) and composes components — it doesn't contain business logic
  that belongs in `lib/`.
- Every component gets its own folder under `components/`, named after the
  component (PascalCase), containing exactly the component and its styles:
  ```
  components/
    Post/
      Post.tsx
      Post.module.css
    FeedStream/
      FeedStream.tsx
      FeedStream.module.css
  ```
  Import styles as `import styles from './ComponentName.module.css'` and
  reference classes via `styles.foo` — no global class names, no bare `.css`
  imports inside a component folder.
- If a component genuinely needs private subcomponents only it uses, nest them
  inside its folder the same way (`Post/PostActions/PostActions.tsx`); don't
  promote them to top-level `components/` unless something else starts using them.
- `lib/` files must not import from `components/` — dependency direction is
  `components -> hooks -> lib`, never the reverse.
- Anything reused across 2+ components goes in `hooks/` or `lib/`; don't inline-duplicate.
- Global/reset styles stay in `app/app.css`. Component-scoped styles always go in
  that component's `.module.css`, never appended to the global stylesheet.

---

## 2. JSDoc Conventions

TypeScript types already describe shapes — don't restate them in prose. JSDoc exists
here for the things types can't express: _why_ something exists, side effects,
non-obvious constraints, and public API surface (exported functions/hooks/components
other files depend on).

### What gets a JSDoc block

- Every exported function in `lib/` and `hooks/`.
- Every exported component in `components/` that takes props (skip trivial
  presentational components with 0-1 self-explanatory props).
- Route loaders/actions where the data contract or auth requirement isn't obvious
  from the code alone.
- Anything with a non-obvious side effect (mutates a cookie, throws on 401, retries).

### What does NOT get a JSDoc

- Internal helper functions not exported from the module.
- Simple prop-drilling components.
- Anything where the function name + TS signature already say it all
  (`export function formatDate(date: Date): string` needs no comment restating that).

### Format

```ts
/**
 * Refreshes the access token using the httpOnly refresh cookie.
 * Called automatically by `apiFetch` on a 401; not meant to be called directly
 * from components.
 *
 * @throws {AuthError} if the refresh cookie is missing or expired — caller
 * must redirect to /auth in that case.
 */
export async function refreshAccessToken(): Promise<void> { ... }
```

```tsx
/**
 * Renders the feed's client-side content. Prerenders as an empty shell (SSG
 * can't bake in personalized data); posts load post-hydration via useEffect.
 *
 * @param initialPosts - Optional server/build-time posts for the logged-out
 * public feed (see /posts/ vs /feed/ split in auth gating).
 */
export function FeedStream({ initialPosts }: FeedStreamProps) { ... }
```

**Style rules:**

- First line: one sentence, imperative mood, ends with a period.
- Blank line, then only the tags that add information (`@param` for non-obvious
  params, `@throws` for thrown errors, `@returns` only if the return value's
  meaning isn't clear from the type).
- Don't add `@param`/`@returns` that just restate the TS type name.
- Note WHY, not WHAT: reference the constraint (e.g. static-export, auth flow)
  driving the code, not a restatement of the function body.

---

## 3. SSG-Specific Rules

- **Build-time vs client-time data**: if data is public and known at build time
  (guest-visible posts, static content), fetch it in a route loader so it's baked
  into the prerendered HTML. If data is personalized/auth-gated (feed, profile),
  it must be fetched client-side post-hydration — that's expected on pure static
  hosting, not a bug to work around.
- **No server runtime assumptions**: no `ssr: true`-only APIs, no Node-only globals
  in code that runs in the browser bundle. Everything under `app/` ships to the client.
- **Auth**: JWT lives in an httpOnly cookie, never localStorage/sessionStorage.
  Don't add code that reads/writes tokens directly — go through `lib/auth.ts`.
- **New routes**: register in `app/routes.ts`; decide at creation time whether the
  route prerenders (public content) or is client-only (auth-gated) — document that
  decision in a one-line comment on the loader, since it's not visible from the code shape.

---

# React TypeScript Coding Standards

This document establishes the official coding standards and type patterns for our React and TypeScript application. The goal is to maximize type safety, ensure code consistency, and minimize runtime bugs.

---

## ⚙️ 4. Tooling & Configuration

### Compiler Requirements

- Strict mode is mandatory (`"strict": true` in `tsconfig.json`).
- Code formatting is handled entirely by Prettier. Do not manually format code.

### File Extensions

- Use `.tsx` for files containing JSX elements.
- Use `.ts` for files containing strictly logic (e.g., helpers, hooks, API routes).

---

## 🧩 5. Component Design Standards

### Structure & Conventions

- Use **PascalCase** for component file and folder names (e.g., `UserProfile.tsx`).
- Avoid using `React.FC` or `React.FunctionalComponent`. Use standard functions instead.
- Keep components under ~200 lines. Abstract complex parts into sub-components.

### Component Code Ordering

Keep internal component code organized in this sequence:

1. Hooks (`useState`, `useContext`, custom hooks)
2. Variable declarations and derived constants
3. `useEffect` blocks
4. Event handlers and helper functions
5. JSX return statement

---

## 🛡️ 6. Type System & Modeling

### Clean Types

- **Ban `any`:** Never use the `any` keyword. If a type is unknown, use `unknown`.
- **Let TypeScript Infer:** Do not explicitly declare type signatures if the compiler can deduce them automatically.
- **Avoid Enums:** Use string literal unions instead of standard TypeScript enums.

### Component Component Pattern

```tsx
// ✅ GOOD: Clean type definitions and parameter destructuring
interface UserCardProps {
  username: string;
  role?: "admin" | "user"; // String literal union instead of enum
}

export function UserCard({ username, role = "user" }: UserCardProps) {
  return (
    <div>
      <h3>{username}</h3>
      <p>Role: {role}</p>
    </div>
  );
}
```

---

## 🪝 7. Hooks & React Types

### Element Refs

Always pass the precise DOM element generic and initialize with `null`.

```typescript
const inputRef = useRef<HTMLInputElement>(null);
```

### Event Handler Typing

Type your elements explicitly when extracting standalone functions.

```typescript
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### Custom Hook Returns

Append `as const` to custom array returns to create exact tuples.

```typescript
const useCustomHook = () => {
  return [value, setValue] as const;
};
```

---

## 🧼 8. Data Flow & Patterns

- **Extract Logic:** Heavy conditional code or state workflows belong in separate custom hooks.
- **Nullish Coalescing:** Use `??` instead of `||` to prevent falsy numbers (`0`) or strings (`""`) from breaking application logic.
- **Early Returns:** Keep components readable by returning error or loading states early.
