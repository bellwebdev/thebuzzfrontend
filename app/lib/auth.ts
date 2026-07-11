import { api } from "~/lib/api";
import type { AuthCredentials, AuthResponse, User } from "~/types/auth";

const USER_KEY = "buzz_user";

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Human-facing name for a user. The backend `UserRead` no longer has a single
 * `name` field — prefer `display_name`, fall back to the required `username`.
 */
export function userDisplayName(
  user: Pick<User, "display_name" | "username">,
): string {
  return user.display_name ?? user.username;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function setStoredUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await api.get<User>("/users/me");
  } catch {
    return null;
  }
}

export async function signIn(credentials: AuthCredentials): Promise<AuthResponse> {
  const form = new URLSearchParams({ username: credentials.username ?? "", password: credentials.password });
  const API_URL = import.meta.env.PROD ? "https://api.the-buzz-app.com" : "http://localhost:8000";
  const res = await fetch(`${API_URL}/auth/jwt/login`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error(`Sign in failed: ${res.status}`);
  const user = await api.get<User>("/users/me");
  return { user };
}

export async function signUp(credentials: AuthCredentials): Promise<AuthResponse> {
  await api.post("/auth/register", {
    email: credentials.email,
    password: credentials.password,
    ...(credentials.username ? { username: credentials.username } : {}),
    ...(credentials.displayName ? { display_name: credentials.displayName } : {}),
  });
  // Auto-login after registration — use email as the OAuth2 username field
  return signIn({ username: credentials.email, password: credentials.password });
}

export async function signOut(): Promise<void> {
  try {
    await api.post("/auth/jwt/logout");
  } catch {
    // Proceed with local cleanup even if server call fails
  }
  clearStoredUser();
}
