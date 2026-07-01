import { Event } from "~/components/Event/Event";
import type { Event as EventType } from "~/types";

type EventsProps = {
  events: EventType[];
};

export function Events({ events }: EventsProps) {
  return (
    <>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </>
  );
}
