import { useState } from "react";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { SignInPrompt } from "~/components/SignInPrompt/SignInPrompt";
import { useToast } from "~/components/Toast/Toast";
import { getInitials } from "~/lib/auth";
import { api } from "~/lib/api";
import { colorFromId, formatEventDate } from "~/lib/utils";
import type { ApiEvent, ApiPost, Event, Post } from "~/types";
import styles from "./ComposePost.module.css";

type ComposePostProps = {
  onPost: (post: Post) => void;
  onEvent: (event: Event) => void;
};

type Mode = "post" | "event";

export function ComposePost({ onPost, onEvent }: ComposePostProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>("post");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");

  if (!isAuthenticated || !user) {
    return (
      <SignInPrompt
        title="Share something with the hive"
        description="Sign in to post ideas, find collaborators, and spark something in the Lehigh Valley."
      />
    );
  }

  const handlePostSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("Write something first!");
      return;
    }

    try {
      const created = await api.post<ApiPost>("/posts/", {
        content: trimmed,
        visibility: "public",
      });
      onPost({
        id: created.id,
        authorName: user.name ?? user.email,
        authorInitials: getInitials(user.name),
        authorColor: colorFromId(user.id),
        body: trimmed,
        time: "Just now",
        likeCount: 0,
        commentCount: 0,
      });
      setText("");
      showToast("Posted! 🐝");
    } catch {
      showToast("Failed to post. Try again.");
    }
  };

  const handleEventSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription || !startTime) {
      showToast("Add a title, description, and date first!");
      return;
    }

    try {
      const created = await api.post<ApiEvent>("/events/", {
        title: trimmedTitle,
        description: trimmedDescription,
        location: location.trim() || null,
        start_time: new Date(startTime).toISOString(),
      });
      onEvent({
        id: created.id,
        title: created.title,
        description: created.description,
        dateLabel: formatEventDate(created.start_time),
        attendeeCount: created.attendee_count,
        attendeeInitials: created.attendee_preview.map((a) =>
          getInitials(a.name),
        ),
        attendeeColors: created.attendee_preview.map((a) => colorFromId(a.id)),
        joined: created.is_attending,
      });
      setTitle("");
      setDescription("");
      setLocation("");
      setStartTime("");
      showToast("Event created! 🎉");
    } catch {
      showToast("Failed to create event. Try again.");
    }
  };

  return (
    <div className={styles.composeCard}>
      <div className={styles.composeHeader}>
        <div
          className="sidebar-avatar"
          style={{ width: 42, height: 42, fontSize: 14, flexShrink: 0 }}
        >
          {getInitials(user.name)}
        </div>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${mode === "post" ? " active" : ""}`}
            onClick={() => setMode("post")}
          >
            Post
          </button>
          <button
            type="button"
            className={`auth-tab${mode === "event" ? " active" : ""}`}
            onClick={() => setMode("event")}
          >
            Event
          </button>
        </div>
      </div>
      <div className={styles.composeRow}>
        <div className={styles.avatarSpacer} />
        {mode === "post" ? (
          <div className={styles.composeInputWrap}>
            <textarea
              className={styles.composeInput}
              placeholder="What do you want to start? Share an idea, find people, spark something…"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.composeActions}>
              <button
                type="button"
                className="btn-primary"
                onClick={handlePostSubmit}
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.composeInputWrap}>
            <input
              className={styles.composeField}
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className={styles.composeInput}
              placeholder="What's happening?"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles.composeFieldRow}>
              <input
                className={styles.composeField}
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                className={styles.composeField}
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className={styles.composeActions}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleEventSubmit}
              >
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
