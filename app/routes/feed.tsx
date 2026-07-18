import { useEffect, useState } from "react";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { ComposeFab } from "~/components/ComposeFab/ComposeFab";
import { Event as EventCard } from "~/components/Event/Event";
import { FeedStream } from "~/components/FeedStream/FeedStream";
import { api } from "~/lib/api";
import { mapApiEvent } from "~/lib/mappers";
import { hydratePost } from "~/lib/posts";
import type { ApiEvent, ApiPost, Event, FeedItem, Post } from "~/types";
import styles from "./feed.module.css";
import type { Route } from "./+types/feed";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Buzz" },
    { name: "description", content: "The Buzz — Lehigh Valley community" },
  ];
}

type Tab = "feed" | "local";

export default function Feed() {
  const { isReady } = useAuth();
  const [tab, setTab] = useState<Tab>("feed");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [localEvents, setLocalEvents] = useState<Event[]>([]);

  // Client-only fetch: /posts/ is public but personalized like state (liked_by_me)
  // depends on the auth cookie, so this can't be baked in at build time (SSG).
  useEffect(() => {
    if (!isReady) return;

    Promise.all([api.get<ApiPost[]>("/posts/"), api.get<ApiEvent[]>("/events/")])
      .then(async ([posts, events]) => {
        const hydratedPosts = await Promise.all(posts.map(hydratePost));
        const postItems: FeedItem[] = hydratedPosts.map((data) => ({ type: "post", data }));
        const eventItems: FeedItem[] = events.map((e) => ({ type: "event", data: mapApiEvent(e) }));
        setItems([...eventItems, ...postItems]);
      })
      .catch((err) => {
        console.error("Failed to load feed:", err);
      });

    api
      .get<ApiEvent[]>("/events/?source=ticketmaster")
      .then((events) => setLocalEvents(events.map(mapApiEvent)))
      .catch((err) => console.error("Failed to load local events:", err));
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
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab}${tab === "feed" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setTab("feed")}
          >
            Feed
          </button>
          <button
            type="button"
            className={`${styles.tab}${tab === "local" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setTab("local")}
          >
            Local Events
          </button>
        </div>
        {tab === "feed" ? (
          <FeedStream items={items} />
        ) : (
          localEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
      <ComposeFab onPost={handleNewPost} onEvent={handleNewEvent} />
    </div>
  );
}
