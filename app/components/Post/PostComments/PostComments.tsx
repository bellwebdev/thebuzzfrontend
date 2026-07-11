import { useEffect, useState } from "react";

import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast/Toast";
import { createComment, fetchComments } from "~/lib/comments";
import { mapApiComment } from "~/lib/mappers";
import type { Comment } from "~/types";
import styles from "./PostComments.module.css";

type PostCommentsProps = {
  postId: string;
  onCountChange: (count: number) => void;
};

/**
 * Comment thread for a single post. Fetches on mount (i.e. when the parent
 * expands it), lists top-level comments, and lets authed users add one.
 * Reports the top-level count up so the post's badge stays in sync.
 */
export function PostComments({ postId, onCountChange }: PostCommentsProps) {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchComments(postId)
      .then((data) => {
        if (!active) return;
        const mapped = data.map(mapApiComment);
        setComments(mapped);
        onCountChange(mapped.length);
      })
      .catch(() => showToast("Couldn't load comments."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // onCountChange/showToast are stable enough for this one-shot load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    requireAuth(async () => {
      try {
        const created = mapApiComment(await createComment(postId, trimmed));
        setComments((prev) => {
          const next = [...prev, created];
          onCountChange(next.length);
          return next;
        });
        setDraft("");
      } catch {
        showToast("Failed to comment. Try again.");
      }
    }, "Sign in to comment");
  };

  return (
    <div className={styles.thread}>
      {loading ? (
        <p className={styles.empty}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className={styles.empty}>No comments yet. Start the conversation.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentAvatar} style={{ background: comment.authorColor }}>
              {comment.authorInitials}
            </div>
            <div className={styles.commentBody}>
              <p className={styles.commentText}>{comment.body}</p>
              <span className={styles.commentTime}>{comment.time}</span>
            </div>
          </div>
        ))
      )}
      <div className={styles.composer}>
        <input
          className={styles.composerInput}
          type="text"
          placeholder={isAuthenticated ? "Add a comment…" : "Sign in to comment"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
        />
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
}
