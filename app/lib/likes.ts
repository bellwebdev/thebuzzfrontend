import { api } from "~/lib/api";
import type { ApiLikeCount } from "~/types";

/** Like count + whether the current user liked it. Public (guests get `liked_by_me: false`). */
export function fetchLikeCount(postId: string): Promise<ApiLikeCount> {
  return api.get<ApiLikeCount>(`/posts/${postId}/likes`);
}

export function likePost(postId: string): Promise<unknown> {
  return api.post(`/posts/${postId}/like`);
}

export function unlikePost(postId: string): Promise<unknown> {
  return api.delete(`/posts/${postId}/like`);
}
