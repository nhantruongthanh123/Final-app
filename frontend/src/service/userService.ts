import { api } from "@/service/config";
import type { User } from "@/types/user";

export const UserService = {
  getAllUsers: async (
    page: number,
    limit: number,
  ): Promise<{ users: User[]; totalUsers: number }> => {
    const res = await api.get<{ users: User[]; totalUsers: number }>(
      `/users?page=${page}&limit=${limit}`,
    );

    return res.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);

    return res.data;
  },
};
