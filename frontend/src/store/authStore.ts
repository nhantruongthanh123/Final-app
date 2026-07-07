import { create } from "zustand";
import type { User } from "@/types/user";
import type { AuthState } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  setAuth: (accessToken: string, user: User) => {
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },

  setCheckingAuth: (status: boolean) => {
    set({
      isCheckingAuth: status,
    });
  },
}));
