import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "~/components/AuthProvider/AuthProvider";
import { useToast } from "~/components/Toast/Toast";

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const requireAuth = useCallback(
    (action: () => void, message = "Sign in to continue") => {
      if (isAuthenticated) {
        action();
        return true;
      }

      showToast(message);
      navigate("/auth?from=/");
      return false;
    },
    [isAuthenticated, navigate, showToast],
  );

  return { isAuthenticated, requireAuth };
}
