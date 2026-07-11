import { api } from "~/lib/api";
import type { ApiEvent, ApiHive, ApiPost } from "~/types";

/**
 * List hives (the seeded taxonomy). Public — no auth required.
 *
 * @param includeInactive - include hives flagged inactive (admin/browse views).
 */
export function fetchHives(includeInactive = false): Promise<ApiHive[]> {
  const query = includeInactive ? "?include_inactive=true" : "";
  return api.get<ApiHive[]>(`/hives/${query}`);
}

/** Fetch a single hive by slug. Rejects (404) if the slug is unknown. */
export function fetchHive(slug: string): Promise<ApiHive> {
  return api.get<ApiHive>(`/hives/${slug}`);
}

export function fetchHivePosts(slug: string): Promise<ApiPost[]> {
  return api.get<ApiPost[]>(`/hives/${slug}/posts`);
}

export function fetchHiveEvents(slug: string): Promise<ApiEvent[]> {
  return api.get<ApiEvent[]>(`/hives/${slug}/events`);
}
