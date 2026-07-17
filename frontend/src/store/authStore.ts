import type { AuthState } from "@/types/auth";
import type { User } from "@/types/user";
import { create } from "zustand";

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

  updateUser: (user: User) => {
    set((state) => ({
      ...state,
      user,
    }));
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
