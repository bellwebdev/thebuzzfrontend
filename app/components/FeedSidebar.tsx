import { useAuth } from "~/components/AuthProvider";
import { SignInPrompt } from "~/components/SignInPrompt";
import { getInitials } from "~/lib/auth";

const HIVES = [
  { emoji: "🎵", name: "Music", count: "312 members", color: "#F26522" },
  { emoji: "🏀", name: "Sports", count: "548 members", color: "#3B82F6" },
  { emoji: "🌱", name: "Activism", count: "187 members", color: "#10B981" },
] as const;

export function FeedSidebar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <aside className="sidebar">
      {isAuthenticated && user ? (
        <div className="sidebar-card">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-sub">{user.email}</div>
            </div>
          </div>
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <div className="sidebar-stat-n">142</div>
              <div className="sidebar-stat-l">Following</div>
            </div>
            <div className="sidebar-stat">
              <div className="sidebar-stat-n">89</div>
              <div className="sidebar-stat-l">Followers</div>
            </div>
            <div className="sidebar-stat">
              <div className="sidebar-stat-n">24</div>
              <div className="sidebar-stat-l">Posts</div>
            </div>
            <div className="sidebar-stat">
              <div className="sidebar-stat-n">6</div>
              <div className="sidebar-stat-l">Hives</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar-card">
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
