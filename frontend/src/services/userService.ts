import { api } from "@/services/axiosClient";
import type { Album } from "@/types/album";
import type { Photo } from "@/types/photo";
import type {
  UpdateUserProfileData,
  User,
  UserWithFollowStatus,
} from "@/types/user";

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

  getAllUserFollowings: async (): Promise<UserWithFollowStatus[]> => {
    const res = await api.get<UserWithFollowStatus[]>(`/users/followings`);
    return res.data;
  },

  getAllUserFollowers: async (): Promise<UserWithFollowStatus[]> => {
    const res = await api.get<UserWithFollowStatus[]>(`/users/followers`);
    return res.data;
  },

  followUser: async (userId: string): Promise<void> => {
    await api.post(`/users/${userId}/follow`);
  },

  unfollowUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}/unfollow`);
  },

  updateUserProfile: async (data: UpdateUserProfileData): Promise<User> => {
    const res = await api.patch<User>(`/users/me`, data);
    return res.data;
  },

  updateUserPassword: async (data: {
    password: string;
    newPassword: string;
  }): Promise<User> => {
    const res = await api.patch<User>(`/users/me/password`, data);
    return res.data;
  },

  updateUserAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.patch<User>(`/users/me/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data;
  },

  likePhoto: async (photoId: string): Promise<void> => {
    await api.post(`/users/${photoId}/likePhoto`);
  },

  unlikePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/users/${photoId}/likePhoto`);
  },

  likeAlbum: async (albumId: string): Promise<void> => {
    await api.post(`/users/${albumId}/likeAlbum`);
  },

  unlikeAlbum: async (albumId: string): Promise<void> => {
    await api.delete(`/users/${albumId}/likeAlbum`);
  },
};
