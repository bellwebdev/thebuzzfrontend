import { useState } from "react";

import { CommentIcon, HeartIcon, ShareIcon } from "~/components/icons";
import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast/Toast";
import type { Post as PostType } from "~/types";
import styles from "./Post.module.css";

type PostProps = {
  post: PostType;
};

export function Post({ post: initialPost }: PostProps) {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [post, setPost] = useState(initialPost);

  const toggleLike = () => {
    requireAuth(() => {
      setPost((prev) => ({
        ...prev,
        liked: !prev.liked,
        likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    }, "Sign in to like posts");
  };

  const handleComment = () => {
    requireAuth(() => showToast("Comments coming soon!"), "Sign in to comment");
  };

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <button type="button" className={styles.postAvatar} style={{ background: post.authorColor }}>
          {post.authorInitials}
        </button>
        <div className={styles.postMeta}>
          <button type="button" className={styles.postName}>
            {post.authorName}
          </button>
          <div className={styles.postTime}>
            {post.time}
            {post.hive ? ` · ${post.hive}` : ""}
          </div>
        </div>
        {post.tag ? <span className={styles.postTag}>{post.tag}</span> : null}
      </header>
      <p className={styles.postBody}>{post.body}</p>
      <div className={styles.postActions}>
        <button
          type="button"
          className={`${styles.postAction}${post.liked ? ` ${styles.liked}` : ""}${!isAuthenticated ? ` ${styles.postActionGuest}` : ""}`}
          onClick={toggleLike}
          aria-disabled={!isAuthenticated}
        >
          <HeartIcon filled={post.liked} />
          <span>{post.likeCount}</span>
        </button>
        <button
          type="button"
          className={`${styles.postAction}${!isAuthenticated ? ` ${styles.postActionGuest}` : ""}`}
          onClick={handleComment}
          aria-disabled={!isAuthenticated}
        >
          <CommentIcon />
          <span>{post.commentCount}</span>
        </button>
        <button type="button" className={styles.postAction} onClick={() => showToast("Shared!")}>
          <ShareIcon />
          Share
        </button>
      </div>
    </article>
  );
}
