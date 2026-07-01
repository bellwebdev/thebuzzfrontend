import { useState } from "react";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { SignInPrompt } from "~/components/SignInPrompt/SignInPrompt";
import { useToast } from "~/components/Toast/Toast";
import { getInitials } from "~/lib/auth";
import { api } from "~/lib/api";
import { colorFromId } from "~/lib/utils";
import type { ApiPost, Post } from "~/types";
import styles from "./ComposePost.module.css";

type ComposePostProps = {
  onPost: (post: Post) => void;
};

export function ComposePost({ onPost }: ComposePostProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState("");

  if (!isAuthenticated || !user) {
    return (
      <SignInPrompt
        title="Share something with the hive"
        description="Sign in to post ideas, find collaborators, and spark something in the Lehigh Valley."
      />
    );
  }

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("Write something first!");
      return;
    }

    try {
      const created = await api.post<ApiPost>("/posts/", { content: trimmed, visibility: "public" });
      onPost({
        id: created.id,
        authorName: user.name,
        authorInitials: getInitials(user.name),
        authorColor: colorFromId(user.id),
        body: trimmed,
        time: "Just now",
        likeCount: 0,
        commentCount: 0,
      });
      setText("");
      showToast("Posted! 🐝");
    } catch {
      showToast("Failed to post. Try again.");
    }
  };

  return (
    <div className={styles.composeCard}>
      <div className={styles.composeRow}>
        <div className="sidebar-avatar" style={{ width: 42, height: 42, fontSize: 14, flexShrink: 0 }}>
          {getInitials(user.name)}
        </div>
        <div className={styles.composeInputWrap}>
          <textarea
            className={styles.composeInput}
            placeholder="What do you want to start? Share an idea, find people, spark something…"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className={styles.composeActions}>
            <button type="button" className="btn-primary" onClick={handleSubmit}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
