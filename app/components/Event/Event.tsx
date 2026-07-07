import { useState } from "react";

import { CalendarIcon } from "~/components/icons";
import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast/Toast";
import { api } from "~/lib/api";
import type { Event as EventType } from "~/types";
import styles from "./Event.module.css";

type EventProps = {
  event: EventType;
};

export function Event({ event: initialEvent }: EventProps) {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [event, setEvent] = useState(initialEvent);

  const toggleJoin = () => {
    requireAuth(async () => {
      const joining = !event.joined;
      setEvent((prev) => ({
        ...prev,
        joined: joining,
        attendeeCount: joining ? prev.attendeeCount + 1 : prev.attendeeCount - 1,
      }));

      try {
        if (joining) {
          await api.post(`/events/${event.id}/join`);
        } else {
          await api.delete(`/events/${event.id}/join`);
        }
        showToast(joining ? "You're going! 🎉" : "Removed from your events");
      } catch {
        setEvent((prev) => ({
          ...prev,
          joined: !joining,
          attendeeCount: joining ? prev.attendeeCount - 1 : prev.attendeeCount + 1,
        }));
        showToast("Something went wrong. Try again.");
      }
    }, "Sign in to join events");
  };

  return (
    <article className={styles.eventCard}>
      <div className={styles.eventBanner} />
      <div className={styles.eventBody}>
        <div className={styles.eventDateChip}>
          <CalendarIcon />
          {event.dateLabel}
        </div>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDesc}>{event.description}</p>
        <div className={styles.eventFooter}>
          <div className={styles.eventAttendees}>
            <div className={styles.attendeeStack}>
              {event.attendeeInitials.map((initial, i) => (
                <div
                  key={i}
                  className={styles.attendeeDot}
                  style={{ background: event.attendeeColors[i] ?? "#F26522" }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <span>+{event.attendeeCount} going</span>
          </div>
          {isAuthenticated ? (
            <button
              type="button"
              className={`${styles.btnJoin}${event.joined ? ` ${styles.joined}` : ""}`}
              onClick={toggleJoin}
            >
              {event.joined ? "Going ✓" : "Join"}
            </button>
          ) : (
            <button type="button" className={`${styles.btnJoin} ${styles.btnJoinGuest}`} onClick={toggleJoin}>
              Join
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
