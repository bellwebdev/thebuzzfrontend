import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { FeedStream } from "~/components/FeedStream/FeedStream";
import { fetchHive, fetchHiveEvents, fetchHivePosts } from "~/lib/hives";
import { mapApiEvent, mapApiHive } from "~/lib/mappers";
import { hydratePost } from "~/lib/posts";
import type { FeedItem, Hive } from "~/types";
import styles from "./hive.module.css";
import { Container } from "~/components/Container/Container";

// Client-only fetch: hive content is public but depends on the auth cookie for
// personalized state (liked_by_me / is_attending), so it can't be prerendered.
export default function HivePage() {
  const { slug } = useParams();
  const { isReady } = useAuth();
  const [hive, setHive] = useState<Hive | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isReady || !slug) return;

    fetchHive(slug)
      .then((data) => setHive(mapApiHive(data)))
      .catch(() => setNotFound(true));

    Promise.all([fetchHivePosts(slug), fetchHiveEvents(slug)])
      .then(async ([posts, events]) => {
        const hydratedPosts = await Promise.all(posts.map(hydratePost));
        const postItems: FeedItem[] = hydratedPosts.map((data) => ({
          type: "post",
          data,
        }));
        const eventItems: FeedItem[] = events.map((e) => ({
          type: "event",
          data: mapApiEvent(e),
        }));
        setItems([...eventItems, ...postItems]);
      })
      .catch((err) => console.error("Failed to load hive content:", err));
  }, [isReady, slug]);

  if (notFound) {
    return (
      <Container>
        <div className="feed">
          <p className={styles.empty}>
            That hive doesn't exist. <Link to="/hives">Browse all hives</Link>.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="feed">
        <Link to="/hives" className={styles.back}>
          ← All hives
        </Link>
        <header className={styles.header}>
          <span
            className={styles.hex}
            style={{ background: hive?.color ?? "var(--orange)" }}
          >
            {hive?.name.charAt(0).toUpperCase() ?? "…"}
          </span>
          <div>
            <h1 className={styles.name}>{hive?.name ?? "Loading…"}</h1>
            {hive?.description ? (
              <p className={styles.desc}>{hive.description}</p>
            ) : null}
          </div>
        </header>
        {items.length === 0 ? (
          <p className={styles.empty}>
            Nothing here yet. Be the first to post in this hive.
          </p>
        ) : (
          <FeedStream items={items} />
        )}
      </div>
    </Container>
  );
}
