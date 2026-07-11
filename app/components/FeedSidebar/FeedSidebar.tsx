import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { SignInPrompt } from "~/components/SignInPrompt/SignInPrompt";
import { getInitials, userDisplayName } from "~/lib/auth";
import styles from "./FeedSidebar.module.css";

const HIVES = [
  { emoji: "🎵", name: "Music", count: "312 members", color: "#F26522" },
  { emoji: "🏀", name: "Sports", count: "548 members", color: "#3B82F6" },
  { emoji: "🌱", name: "Activism", count: "187 members", color: "#10B981" },
] as const;

export function FeedSidebar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      {isAuthenticated && user ? (
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarUser}>
            <div className="sidebar-avatar">{getInitials(userDisplayName(user))}</div>
            <div>
              <div className={styles.sidebarUserName}>{userDisplayName(user)}</div>
              <div className={styles.sidebarUserSub}>{user.email}</div>
            </div>
          </div>
          <div className={styles.sidebarStats}>
            <div className={styles.sidebarStat}>
              <div className={styles.sidebarStatN}>142</div>
              <div className={styles.sidebarStatL}>Following</div>
            </div>
            <div className={styles.sidebarStat}>
              <div className={styles.sidebarStatN}>89</div>
              <div className={styles.sidebarStatL}>Followers</div>
            </div>
            <div className={styles.sidebarStat}>
              <div className={styles.sidebarStatN}>24</div>
              <div className={styles.sidebarStatL}>Posts</div>
            </div>
            <div className={styles.sidebarStat}>
              <div className={styles.sidebarStatN}>6</div>
              <div className={styles.sidebarStatL}>Hives</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.sidebarCard}>
          <SignInPrompt
            compact
            title="Welcome to the buzz"
            description="Browse public posts and events. Sign in to participate."
          />
        </div>
      )}

    </aside>
  );
}
