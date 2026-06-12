import { useEffect, useState } from "react";

import { useAuth } from "~/components/AuthProvider";
import { ComposePost } from "~/components/ComposePost";
import { FeedStream } from "~/components/FeedStream";
import { INITIAL_FEED } from "~/data/feed";
import { api } from "~/lib/api";
import { colorFromId, timeAgo } from "~/lib/utils";
import type { ApiPost, FeedItem, Post } from "~/types";
import type { Route } from "./+types/feed";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Buzz" },
    { name: "description", content: "The Buzz — Lehigh Valley community" },
  ];
}

function mapApiPost(p: ApiPost): Post {
  return {
    id: p.id,
    authorName: p.author?.name ?? "Unknown",
    authorInitials: "",
    authorColor: colorFromId(p.author_id),
    body: p.content,
    time: timeAgo(p.created_at),
    likeCount: 0,
    commentCount: 0,
  };
}

export default function Feed() {
  const { isAuthenticated, isReady } = useAuth();
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED);

  useEffect(() => {
    if (!isReady) return;

    const endpoint = isAuthenticated ? "/feed/" : "/posts/";
    api.get<ApiPost[]>(endpoint).then((posts) => {
      const postItems: FeedItem[] = posts.map((p) => ({ type: "post", data: mapApiPost(p) }));
      setItems((prev) => [
        ...prev.filter((item) => item.type === "event"),
        ...postItems,
      ]);
    }).catch((err) => {
      console.error("Failed to load posts:", err);
    });
  }, [isReady, isAuthenticated]);

  const handleNewPost = (post: Post) => {
    setItems((prev) => [{ type: "post", data: post }, ...prev]);
  };

  return (
    <div className="layout">
      <div className="feed">
        <ComposePost onPost={handleNewPost} />
        <FeedStream items={items} />
      </div>
    </div>
  );
}
