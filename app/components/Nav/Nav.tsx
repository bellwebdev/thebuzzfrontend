import { Link, NavLink } from "react-router";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { getInitials } from "~/lib/auth";
import { Logo } from "~/components/Logo/Logo";
import styles from "./Nav.module.css";

export function Nav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.navLogo}>
        <Logo showText />
      </Link>
      <div className={styles.navLinks}>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`}
          end
        >
          Feed
        </NavLink>
        {isAuthenticated ? (
          <>
            <button type="button" className={`${styles.navLink} ${styles.navLinkDesktop}`} onClick={() => {}}>
              Hives
            </button>
            <button type="button" className={`${styles.navLink} ${styles.navLinkDesktop}`} onClick={() => {}}>
              Profile
            </button>
          </>
        ) : null}
      </div>
      {isAuthenticated && user ? (
        <button
          type="button"
          className={styles.navAvatar}
          aria-label={`Signed in as ${user.name ?? user.email}. Sign out.`}
          title={`${user.name ?? user.email} — click to sign out`}
          onClick={logout}
        >
          {getInitials(user.name)}
        </button>
      ) : (
        <Link to="/auth?from=/" className={styles.navSignIn}>
          Sign in
        </Link>
      )}
    </nav>
  );
}
