import { Link } from "react-router";

import styles from "./SignInPrompt.module.css";

type SignInPromptProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export function SignInPrompt({
  title = "Join the conversation",
  description = "Sign in to post, like, and comment on the buzz.",
  compact = false,
}: SignInPromptProps) {
  return (
    <div className={`${styles.signInPrompt}${compact ? ` ${styles.signInPromptCompact}` : ""}`}>
      <div>
        <p className={styles.signInPromptTitle}>{title}</p>
        <p className={styles.signInPromptDesc}>{description}</p>
      </div>
      <Link to="/auth?from=/" className={`btn-primary ${styles.signInPromptBtn}`}>
        Sign in
      </Link>
    </div>
  );
}
