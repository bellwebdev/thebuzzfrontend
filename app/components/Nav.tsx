import { Link, NavLink } from "react-router";

import { useAuth } from "~/components/AuthProvider";
import { getInitials } from "~/lib/auth";
import { Logo } from "~/components/Logo";

export function Nav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <Logo showText />
      </Link>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          end
        >
          Feed
        </NavLink>
        {isAuthenticated ? (
          <>
            <button type="button" className="nav-link nav-link-desktop" onClick={() => {}}>
              Hives
            </button>
            <button type="button" className="nav-link nav-link-desktop" onClick={() => {}}>
              Profile
            </button>
          </>
        ) : null}
      </div>
      {isAuthenticated && user ? (
        <button
          type="button"
          className="nav-avatar"
          aria-label={`Signed in as ${user.name ?? user.email}. Sign out.`}
          title={`${user.name ?? user.email} — click to sign out`}
          onClick={logout}
        >
          {getInitials(user.name)}
        </button>
      ) : (
        <Link to="/auth?from=/" className="nav-sign-in">
          Sign in
        </Link>
      )}
    </nav>
  );
}
