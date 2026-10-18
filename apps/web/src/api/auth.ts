import { apiFetch } from "./client";

export interface AuthUser {
  id: number;
  username: string;
  fullName: string | null;
}

export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),

  me: () => apiFetch<{ user: AuthUser }>("/auth/me"),
};