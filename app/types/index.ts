export type Visibility = "public" | "friends" | "private";

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
  hive?: string;
  attendeeCount: number;
  attendeeInitials: string[];
  attendeeColors: string[];
  joined?: boolean;
};

export type Hive = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
  iconUrl: string | null;
};

export type Comment = {
  id: string;
  authorId: string;
  authorInitials: string;
  authorColor: string;
  body: string;
  time: string;
  replies: Comment[];
};

export type FeedItem =
  | { type: "post"; data: Post }
  | { type: "event"; data: Event };

// --- Backend response shapes (mirror the FastAPI *Read schemas) ---

export type ApiAuthor = { id: string; name: string };

export type ApiAttendee = { id: string; name: string; avatar_url: string | null };

export type ApiHive = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  color_hex: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiPost = {
  id: string;
  author_id: string;
  author?: ApiAuthor;
  hive_id: string | null;
  hive: ApiHive | null;
  content: string;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type ApiEvent = {
  id: string;
  organizer_id: string;
  organizer: ApiAuthor;
  hive_id: string | null;
  hive: ApiHive | null;
  title: string;
  description: string;
  location: string | null;
  start_time: string;
  created_at: string;
  updated_at: string;
  attendee_count: number;
  attendee_preview: ApiAttendee[];
  is_attending: boolean;
};

export type ApiComment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  replies: ApiComment[];
};

/** Response of `GET /posts/{id}/likes`. `liked_by_me` is always false for guests. */
export type ApiLikeCount = {
  count: number;
  liked_by_me: boolean;
};
