import type {
  ApiComment,
  ApiEvent,
  ApiHive,
  ApiLikeCount,
  ApiPost,
  Comment,
  Event,
  Hive,
  Post,
} from "~/types";
import { getInitials } from "~/lib/auth";
import { colorFromId, formatEventDate, timeAgo } from "~/lib/utils";

export function mapApiHive(h: ApiHive): Hive {
  return {
    id: h.id,
    slug: h.slug,
    name: h.name,
    description: h.description,
    color: h.color_hex ?? colorFromId(h.id),
    iconUrl: h.icon_url,
  };
}

/**
 * Shape a `PostRead` into the view model. Like/comment counts live on separate
 * endpoints (`/posts/{id}/likes`, `/posts/{id}/comments`), so they're passed in
 * rather than read off the post — callers fetch them alongside the list.
 */
export function mapApiPost(p: ApiPost, likes?: ApiLikeCount, commentCount = 0): Post {
  const name = p.author?.name ?? "Unknown";
  return {
    id: p.id,
    authorName: name,
    authorInitials: getInitials(name),
    authorColor: colorFromId(p.author_id),
    body: p.content,
    time: timeAgo(p.created_at),
    hive: p.hive?.name,
    likeCount: likes?.count ?? 0,
    commentCount,
    liked: likes?.liked_by_me ?? false,
  };
}

export function mapApiEvent(e: ApiEvent): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    dateLabel: formatEventDate(e.start_time),
    hive: e.hive?.name,
    attendeeCount: e.attendee_count,
    attendeeInitials: e.attendee_preview.map((a) => getInitials(a.name)),
    attendeeColors: e.attendee_preview.map((a) => colorFromId(a.id)),
    joined: e.is_attending,
  };
}

/**
 * Shape a `CommentRead` (and its nested replies) into the view model. Comments
 * only carry `author_id`, so the display name isn't available — we render an
 * id-derived avatar color and initials from the id.
 */
export function mapApiComment(c: ApiComment): Comment {
  return {
    id: c.id,
    authorId: c.author_id,
    authorInitials: c.author_id.slice(0, 2).toUpperCase(),
    authorColor: colorFromId(c.author_id),
    body: c.content,
    time: timeAgo(c.created_at),
    replies: c.replies?.map(mapApiComment) ?? [],
  };
}
