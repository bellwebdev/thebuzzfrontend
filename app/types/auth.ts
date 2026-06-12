export type User = {
  id: string;
  name?: string | null;
  email: string;
};

export type AuthCredentials = {
  username?: string;
  email?: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  user: User;
};
