import { useState } from "react";

import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast";

const SUGGESTIONS = [
  { id: "al", initials: "AL", name: "Alex Lee", sub: "Music · Arts", color: "#F26522" },
  { id: "pw", initials: "PW", name: "Priya Wong", sub: "Tech · Startups", color: "#3B82F6", following: true },
  { id: "cm", initials: "CM", name: "Carlos M.", sub: "Sports · Community", color: "#10B981" },
  { id: "nj", initials: "NJ", name: "Nina James", sub: "Art · Activism", color: "#8B5CF6" },
] as const;

export function RightSidebar() {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [following, setFollowing] = useState<Record<string, boolean>>({
    pw: true,
  });

  const toggleFollow = (id: string) => {
    requireAuth(() => {
      setFollowing((prev) => {
        const next = !prev[id];
        showToast(next ? "Following!" : "Unfollowed");
        return { ...prev, [id]: next };
      });
    }, "Sign in to follow people");
  };

  return null;
}
