import { useState } from "react";
import { Link } from "react-router";

import { CommentIcon, HeartIcon, ShareIcon } from "~/components/icons";
import { PostComments } from "~/components/Post/PostComments/PostComments";
import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast/Toast";
import { likePost, unlikePost } from "~/lib/likes";
import type { Post as PostType } from "~/types";
import styles from "./Post.module.css";

type PostProps = {
  post: PostType;
};

export function Post({ post: initialPost }: PostProps) {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    requireAuth(async () => {
      const liking = !post.liked;
      setPost((prev) => ({
        ...prev,
        liked: liking,
        likeCount: liking ? prev.likeCount + 1 : prev.likeCount - 1,
      }));

      try {
        await (liking ? likePost(post.id) : unlikePost(post.id));
      } catch {
        setPost((prev) => ({
          ...prev,
          liked: !liking,
          likeCount: liking ? prev.likeCount - 1 : prev.likeCount + 1,
        }));
        showToast("Something went wrong. Try again.");
      }
    }, "Sign in to like posts");
  };

  const handleCommentCountChange = (commentCount: number) => {
    setPost((prev) => ({ ...prev, commentCount }));
  };

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <button
          type="button"
          className={styles.postAvatar}
          style={{ background: post.authorColor }}
        >
          {post.authorInitials}
        </button>
        <div className={styles.postMeta}>
          <Link to={`/u/${post.authorUsername}`} className={styles.postName}>
            {post.authorName}
          </Link>
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
          className={`${styles.postAction}${showComments ? ` ${styles.liked}` : ""}`}
          onClick={() => setShowComments((prev) => !prev)}
          aria-expanded={showComments}
        >
          <CommentIcon />
          <span>{post.commentCount}</span>
        </button>
        <button
          type="button"
          className={styles.postAction}
          onClick={() => showToast("Shared!")}
        >
          <ShareIcon />
          Share
        </button>
      </div>
      {showComments ? (
        <PostComments
          postId={post.id}
          onCountChange={handleCommentCountChange}
        />
      ) : null}
    </article>
  );
}
