import { api } from "~/lib/api";
import type { ApiComment } from "~/types";

/** Threaded comments for a post (top-level items carry nested `replies`). Public. */
export function fetchComments(postId: string): Promise<ApiComment[]> {
  return api.get<ApiComment[]>(`/posts/${postId}/comments`);
}

export function createComment(
  postId: string,
  content: string,
  parentId?: string,
): Promise<ApiComment> {
  return api.post<ApiComment>(`/posts/${postId}/comments`, {
    content,
    ...(parentId ? { parent_id: parentId } : {}),
  });
}

export function deleteComment(postId: string, commentId: string): Promise<unknown> {
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}
