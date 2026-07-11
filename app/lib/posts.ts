import { fetchComments } from "~/lib/comments";
import { fetchLikeCount } from "~/lib/likes";
import { mapApiPost } from "~/lib/mappers";
import type { ApiPost, Post } from "~/types";

/**
 * Shape a post into the view model, fetching its like + comment counts from
 * their separate endpoints (`PostRead` carries neither). Count failures degrade
 * to zero rather than dropping the post.
 */
export async function hydratePost(p: ApiPost): Promise<Post> {
  const [likes, comments] = await Promise.all([
    fetchLikeCount(p.id).catch(() => undefined),
    fetchComments(p.id).catch(() => []),
  ]);
  return mapApiPost(p, likes, comments.length);
}
