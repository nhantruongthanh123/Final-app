import type { User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;

  // Actions
  setAuth: (accessToken: string, user: User) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setCheckingAuth: (status: boolean) => void;
}
