import { api } from "@/services/axiosClient";
import type { User } from "@/types/user";

export const AuthService = {
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> => {
    await api.post("/auth/register", { email, password, firstName, lastName });
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
};
