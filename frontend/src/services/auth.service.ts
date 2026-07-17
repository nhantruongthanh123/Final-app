import type { RegisterFormValues } from "@/schemas/auth.schema";
import { api } from "@/services/axiosClient";
import type { User } from "@/types/user";

export const AuthService = {
  register: async (data: RegisterFormValues): Promise<void> => {
    await api.post("/auth/register", data);
  },
  login: async (
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  refreshToken: async (): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
      `/auth/forgot-password`,
      {
        email,
      },
      { timeout: 15000 },
    );
    return res.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
      `/auth/reset-password`,
      {
        token,
        newPassword,
      },
      { timeout: 15000 },
    );
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await api.post(
      "/auth/verify-email",
      { token },
      { timeout: 15000 },
    );
    return res.data;
  },

  resendVerificationEmail: async (email: string) => {
    const res = await api.post(
      "/auth/resend-verification-email",
      { email },
      { timeout: 15000 },
    );
    return res.data;
  },
};
