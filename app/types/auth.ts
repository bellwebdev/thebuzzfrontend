export type User = {
  id: string;
  email: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

export type AuthCredentials = {
  username?: string;
  email?: string;
  password: string;
  displayName?: string;
};

export type AuthResponse = {
  user: User;
};
