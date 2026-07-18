export type Visibility = "public" | "friends" | "private";

export type Post = {
  id: string;
  authorName: string;
  authorUsername: string;
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

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  initials: string;
  color: string;
  joinedLabel: string;
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

// Post authors additionally carry `username` (see backend AuthorRead); event
// organizers (ApiAuthor) don't have this field yet.
export type ApiPostAuthor = ApiAuthor & { username: string };

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
  author?: ApiPostAuthor;
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

/** Response of `GET /users/{username}` (backend `PublicProfileRead`). */
export type ApiPublicProfile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
};
