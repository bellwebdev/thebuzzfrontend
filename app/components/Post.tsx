import { useState } from "react";

import { CommentIcon, HeartIcon, ShareIcon } from "~/components/icons";
import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast";
import type { Post as PostType } from "~/types";

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
    <article className="post-card">
      <header className="post-header">
        <button type="button" className="post-avatar" style={{ background: post.authorColor }}>
          {post.authorInitials}
        </button>
        <div className="post-meta">
          <button type="button" className="post-name">
            {post.authorName}
          </button>
          <div className="post-time">
            {post.time}
            {post.hive ? ` · ${post.hive}` : ""}
          </div>
        </div>
        {post.tag ? <span className="post-tag">{post.tag}</span> : null}
      </header>
      <p className="post-body">{post.body}</p>
      <div className="post-actions">
        <button
          type="button"
          className={`post-action${post.liked ? " liked" : ""}${!isAuthenticated ? " post-action-guest" : ""}`}
          onClick={toggleLike}
          aria-disabled={!isAuthenticated}
        >
          <HeartIcon filled={post.liked} />
          <span>{post.likeCount}</span>
        </button>
        <button
          type="button"
          className={`post-action${!isAuthenticated ? " post-action-guest" : ""}`}
          onClick={handleComment}
          aria-disabled={!isAuthenticated}
        >
          <CommentIcon />
          <span>{post.commentCount}</span>
        </button>
        <button type="button" className="post-action" onClick={() => showToast("Shared!")}>
          <ShareIcon />
          Share
        </button>
      </div>
    </article>
  );
}
