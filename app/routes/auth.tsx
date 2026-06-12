import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "~/components/AuthProvider";
import { HexLogo } from "~/components/Logo";
import { signIn, signUp } from "~/lib/auth";
import type { Route } from "./+types/auth";

type AuthMode = "signin" | "signup";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign in — The Buzz" }];
}

export default function Auth() {
  const { login, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";

  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isReady && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response =
        mode === "signin"
          ? await signIn({ username, password })
          : await signUp({ email, password, name });

      login(response);
      navigate(redirectTo, { replace: true });
    } catch {
      setError(
        mode === "signin"
          ? "Sign in failed. Check your username and password."
          : "Sign up failed. That email may already be in use.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <HexLogo className="hex-logo" />
          <span className="nav-logo-text">the buzz</span>
        </div>

        <p className="auth-tagline">
          Find your people in the Lehigh Valley. Join hives, share ideas, and spark something.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${mode === "signin" ? " active" : ""}`}
            onClick={() => switchMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`auth-tab${mode === "signup" ? " active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jordan Bell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          ) : null}

          <div className="auth-field">
            <label htmlFor={mode === "signin" ? "username" : "email"}>Email</label>
            <input
              id={mode === "signin" ? "username" : "email"}
              type="email"
              placeholder="you@example.com"
              value={mode === "signin" ? username : email}
              onChange={(e) => (mode === "signin" ? setUsername : setEmail)(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button type="button" onClick={() => switchMode("signup")}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("signin")}>
                Sign in
              </button>
            </>
          )}
        </div>

        <p className="auth-footer" style={{ marginTop: 12 }}>
          <Link to="/">← Back to feed</Link>
        </p>
      </div>
    </div>
  );
}
