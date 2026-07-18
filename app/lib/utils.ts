const AVATAR_COLORS = ["#3B82F6", "#8B5CF6", "#EF4444", "#10B981", "#F26522", "#EC4899"];

export function colorFromId(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

const EVENT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const EVENT_TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  return `${EVENT_DATE_FORMAT.format(date)} · ${EVENT_TIME_FORMAT.format(date)}`;
}

const JOIN_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatJoinDate(isoString: string): string {
  return `Joined ${JOIN_DATE_FORMAT.format(new Date(isoString))}`;
}
