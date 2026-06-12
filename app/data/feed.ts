import type { FeedItem } from "~/types";

export const INITIAL_FEED: FeedItem[] = [
  {
    type: "event",
    data: {
      id: "event-1",
      title: "Poetry Popup at the Ice House",
      description:
        "Open mic night celebrating local Lehigh Valley voices. All skill levels welcome — come read, listen, or just vibe.",
      dateLabel: "Sat, Jun 14 · 7:00 PM",
      attendeeCount: 28,
      attendeeInitials: ["M", "T", "S"],
      attendeeColors: ["#F26522", "#3B82F6", "#10B981"],
    },
  },
];
