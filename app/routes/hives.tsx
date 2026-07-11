import { useEffect, useState } from "react";
import { Link } from "react-router";

import { fetchHives } from "~/lib/hives";
import { mapApiHive } from "~/lib/mappers";
import type { Hive } from "~/types";
import styles from "./hives.module.css";
import type { Route } from "./+types/hives";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hives · The Buzz" },
    { name: "description", content: "Browse the Lehigh Valley's hives on The Buzz." },
  ];
}

// Client-only fetch: hives are public, but the app is a pure static export
// (ssr: false) with no per-slug prerender list, so we load them post-hydration
// for parity with the rest of the client-fetched UI.
export default function Hives() {
  const [hives, setHives] = useState<Hive[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchHives()
      .then((data) => setHives(data.map(mapApiHive)))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="feed">
      <h1 className={styles.heading}>Hives</h1>
      <p className={styles.sub}>Find your people. Every post and event lives in a hive.</p>
      {error ? (
        <p className={styles.empty}>Couldn't load hives. Try again later.</p>
      ) : (
        <div className={styles.grid}>
          {hives.map((hive) => (
            <Link key={hive.id} to={`/hives/${hive.slug}`} className={styles.card}>
              <span className={styles.hex} style={{ background: hive.color }}>
                {hive.iconUrl ? (
                  <img src={hive.iconUrl} alt="" className={styles.icon} />
                ) : (
                  hive.name.charAt(0).toUpperCase()
                )}
              </span>
              <span className={styles.name}>{hive.name}</span>
              {hive.description ? (
                <span className={styles.desc}>{hive.description}</span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
