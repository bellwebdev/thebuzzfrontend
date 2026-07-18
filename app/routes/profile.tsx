import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { Container } from "~/components/Container/Container";
import { FeedStream } from "~/components/FeedStream/FeedStream";
import { mapApiEvent, mapApiProfile } from "~/lib/mappers";
import { fetchProfile, fetchProfileEvents, fetchProfileGoing, fetchProfilePosts } from "~/lib/profiles";
import { hydratePost } from "~/lib/posts";
import type { FeedItem, Profile } from "~/types";
import styles from "./profile.module.css";

type Tab = "posts" | "events" | "going";

const TABS: { key: Tab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "events", label: "Events" },
  { key: "going", label: "Going" },
];

// Client-only fetch: profiles are public, but usernames aren't known at build
// time (SSG, no per-username prerender list), so this loads post-hydration.
export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("posts");
  const [items, setItems] = useState<Record<Tab, FeedItem[]>>({
    posts: [],
    events: [],
    going: [],
  });

  useEffect(() => {
    if (!username) return;

    fetchProfile(username)
      .then((data) => setProfile(mapApiProfile(data)))
      .catch(() => setNotFound(true));

    fetchProfilePosts(username)
      .then(async (posts) => {
        const hydrated = await Promise.all(posts.map(hydratePost));
        setItems((prev) => ({
          ...prev,
          posts: hydrated.map((data) => ({ type: "post", data })),
        }));
      })
      .catch((err) => console.error("Failed to load profile posts:", err));

    fetchProfileEvents(username)
      .then((events) => {
        setItems((prev) => ({
          ...prev,
          events: events.map((e) => ({ type: "event", data: mapApiEvent(e) })),
        }));
      })
      .catch((err) => console.error("Failed to load profile events:", err));

    fetchProfileGoing(username)
      .then((events) => {
        setItems((prev) => ({
          ...prev,
          going: events.map((e) => ({ type: "event", data: mapApiEvent(e) })),
        }));
      })
      .catch((err) => console.error("Failed to load profile going list:", err));
  }, [username]);

  if (notFound) {
    return (
      <Container>
        <div className="feed">
          <p className={styles.empty}>
            That profile doesn't exist. <Link to="/">Back to feed</Link>.
          </p>
        </div>
      </Container>
    );
  }

  const activeItems = items[tab];

  return (
    <Container>
      <div className="feed">
        <header className={styles.header}>
          <span
            className={styles.avatar}
            style={{ background: profile?.color ?? "var(--orange)" }}
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className={styles.avatarImg} />
            ) : (
              profile?.initials ?? "…"
            )}
          </span>
          <div>
            <h1 className={styles.name}>{profile?.displayName ?? "Loading…"}</h1>
            {profile ? <p className={styles.username}>@{profile.username}</p> : null}
          </div>
        </header>
        {profile?.bio ? <p className={styles.bio}>{profile.bio}</p> : null}
        {profile ? <p className={styles.joined}>{profile.joinedLabel}</p> : null}

        <div className={styles.tabs}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`${styles.tab}${tab === key ? ` ${styles.tabActive}` : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeItems.length === 0 ? (
          <p className={styles.empty}>Nothing here yet.</p>
        ) : (
          <FeedStream items={activeItems} />
        )}
      </div>
    </Container>
  );
}
