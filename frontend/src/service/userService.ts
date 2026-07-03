import { api } from "@/service/config";
import type { User } from "@/types/user";

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users");

    return res.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);

    return res.data;
  },
};
