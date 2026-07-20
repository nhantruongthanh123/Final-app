import type {
  EmailPayload,
  LoginPayload,
  RegisterPayload,
} from "@/schemas/auth.schema";
import { api } from "@/services/axiosClient";
import type { User } from "@/types/user";

export const AuthService = {
  register: async (data: RegisterPayload): Promise<void> => {
    await api.post("/auth/register", data);
  },
  login: async (
    data: LoginPayload,
  ): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  refreshToken: async (): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  forgotPassword: async (data: EmailPayload): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
      `/auth/forgot-password`,
      {
        email: data.email,
      },
      { timeout: 15000 },
    );
    return res.data;
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
      `/auth/reset-password`,
      {
        token: data.token,
        newPassword: data.newPassword,
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
