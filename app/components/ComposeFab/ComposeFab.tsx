import { useState } from "react";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { ComposePost } from "~/components/ComposePost/ComposePost";
import { Modal } from "~/components/Modal/Modal";
import { PlusIcon } from "~/components/icons";
import type { Event, Post } from "~/types";
import styles from "./ComposeFab.module.css";

type ComposeFabProps = {
  onPost: (post: Post) => void;
  onEvent: (event: Event) => void;
};

/**
 * Floating action button that opens ComposePost in a modal, so composing
 * doesn't require scrolling back to the top of the feed.
 */
export function ComposeFab({ onPost, onEvent }: ComposeFabProps) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-label="Create a post or event"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon />
      </button>
      {isOpen ? (
        <Modal onClose={() => setIsOpen(false)}>
          <ComposePost
            onPost={(post) => {
              onPost(post);
              setIsOpen(false);
            }}
            onEvent={(event) => {
              onEvent(event);
              setIsOpen(false);
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}
