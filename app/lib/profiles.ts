import { api } from "~/lib/api";
import type { ApiEvent, ApiPost, ApiPublicProfile } from "~/types";

/** Fetch a public profile by username. Rejects (404) if the username is unknown. */
export function fetchProfile(username: string): Promise<ApiPublicProfile> {
  return api.get<ApiPublicProfile>(`/users/${username}`);
}

/** Posts authored by this user. */
export function fetchProfilePosts(username: string): Promise<ApiPost[]> {
  return api.get<ApiPost[]>(`/users/${username}/posts`);
}

/** Events this user is organizing. */
export function fetchProfileEvents(username: string): Promise<ApiEvent[]> {
  return api.get<ApiEvent[]>(`/users/${username}/events`);
}

/** Events this user has joined (RSVP'd to), including ones they didn't organize. */
export function fetchProfileGoing(username: string): Promise<ApiEvent[]> {
  return api.get<ApiEvent[]>(`/users/${username}/going`);
}
