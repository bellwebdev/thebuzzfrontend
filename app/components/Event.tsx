import { useState } from "react";

import { CalendarIcon } from "~/components/icons";
import { useRequireAuth } from "~/hooks/useRequireAuth";
import { useToast } from "~/components/Toast";
import type { Event as EventType } from "~/types";

type EventProps = {
  event: EventType;
};

export function Event({ event: initialEvent }: EventProps) {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { showToast } = useToast();
  const [event, setEvent] = useState(initialEvent);

  const toggleJoin = () => {
    requireAuth(() => {
      setEvent((prev) => {
        const joined = !prev.joined;
        showToast(joined ? "You're going! 🎉" : "Removed from your events");
        return { ...prev, joined };
      });
    }, "Sign in to join events");
  };

  return (
    <article className="event-card">
      <div className="event-banner" />
      <div className="event-body">
        <div className="event-date-chip">
          <CalendarIcon />
          {event.dateLabel}
        </div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc">{event.description}</p>
        <div className="event-footer">
          <div className="event-attendees">
            <div className="attendee-stack">
              {event.attendeeInitials.map((initial, i) => (
                <div
                  key={i}
                  className="attendee-dot"
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
              className={`btn-join${event.joined ? " joined" : ""}`}
              onClick={toggleJoin}
            >
              {event.joined ? "Going ✓" : "Join"}
            </button>
          ) : (
            <button type="button" className="btn-join btn-join-guest" onClick={toggleJoin}>
              Join
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
