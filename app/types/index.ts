export type Post = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  body: string;
  time: string;
  hive?: string;
  tag?: string;
  likeCount: number;
  commentCount: number;
  liked?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  attendeeCount: number;
  attendeeInitials: string[];
  attendeeColors: string[];
  joined?: boolean;
};

export type FeedItem =
  | { type: "post"; data: Post }
  | { type: "event"; data: Event };

export type ApiPost = {
  id: string;
  author_id: string;
  author?: { id: string; name: string };
  content: string;
  visibility: string;
  created_at: string;
  updated_at: string;
};

export type ApiEvent = {
  id: string;
  organizer_id: string;
  organizer: { id: string; name: string };
  title: string;
  description: string;
  location: string | null;
  start_time: string;
  created_at: string;
  updated_at: string;
  attendee_count: number;
  attendee_preview: { id: string; name: string; avatar_url: string | null }[];
  is_attending: boolean;
};
