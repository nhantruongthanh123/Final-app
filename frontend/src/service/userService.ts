import { api } from "@/service/config";
import type { User } from "@/types/user";
import type { Photo } from "@/types/photo";
import type { Album } from "@/types/album";

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

  getAllUserPhotos: async (userID: string): Promise<Photo[]> => {
    const res = await api.get<Photo[]>(`/users/${userID}/photos`);
    return res.data;
  },

  getAllUserAlbums: async (userId: string): Promise<Album[]> => {
    const res = await api.get<Album[]>(`/users/${userId}/albums`);
    return res.data;
  },

  getAllUserFollowings: async (userId: string): Promise<User[]> => {
    const res = await api.get<User[]>(`/users/${userId}/followings`);
    return res.data;
  },

  getAllUserFollowers: async (userId: string): Promise<User[]> => {
    const res = await api.get<User[]>(`/users/${userId}/followers`);
    return res.data;
  },
};
