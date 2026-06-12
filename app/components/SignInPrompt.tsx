import { Link } from "react-router";

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
    <div className={`sign-in-prompt${compact ? " sign-in-prompt-compact" : ""}`}>
      <div>
        <p className="sign-in-prompt-title">{title}</p>
        <p className="sign-in-prompt-desc">{description}</p>
      </div>
      <Link to="/auth?from=/" className="btn-primary sign-in-prompt-btn">
        Sign in
      </Link>
    </div>
  );
}
