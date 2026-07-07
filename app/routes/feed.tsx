import { useEffect, useState } from "react";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { ComposeFab } from "~/components/ComposeFab/ComposeFab";
import { FeedStream } from "~/components/FeedStream/FeedStream";
import { api } from "~/lib/api";
import { getInitials } from "~/lib/auth";
import { colorFromId, formatEventDate, timeAgo } from "~/lib/utils";
import type { ApiEvent, ApiPost, Event, FeedItem, Post } from "~/types";
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

function mapApiEvent(e: ApiEvent): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    dateLabel: formatEventDate(e.start_time),
    attendeeCount: e.attendee_count,
    attendeeInitials: e.attendee_preview.map((a) => getInitials(a.name)),
    attendeeColors: e.attendee_preview.map((a) => colorFromId(a.id)),
    joined: e.is_attending,
  };
}

export default function Feed() {
  const { isReady } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (!isReady) return;

    Promise.all([api.get<ApiPost[]>("/posts/"), api.get<ApiEvent[]>("/events/")])
      .then(([posts, events]) => {
        const postItems: FeedItem[] = posts.map((p) => ({ type: "post", data: mapApiPost(p) }));
        const eventItems: FeedItem[] = events.map((e) => ({ type: "event", data: mapApiEvent(e) }));
        setItems([...eventItems, ...postItems]);
      })
      .catch((err) => {
        console.error("Failed to load feed:", err);
      });
  }, [isReady]);

  const handleNewPost = (post: Post) => {
    setItems((prev) => [{ type: "post", data: post }, ...prev]);
  };

  const handleNewEvent = (event: Event) => {
    setItems((prev) => [{ type: "event", data: event }, ...prev]);
  };

  return (
    <div className="layout">
      <div className="feed">
        <FeedStream items={items} />
      </div>
      <ComposeFab onPost={handleNewPost} onEvent={handleNewEvent} />
    </div>
  );
}
