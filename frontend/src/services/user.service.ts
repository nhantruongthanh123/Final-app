import type { ProfilePayload } from "@/schemas/user.schema";
import { api } from "@/services/axiosClient";
import type { Album } from "@/types/album";
import type { Photo } from "@/types/photo";
import type { User, UserWithFollowStatus } from "@/types/user";

export const UserService = {
  getAllUsers: async (
    page: number,
    limit: number,
    search?: string,
    role?: string,
    isActive?: boolean,
  ): Promise<{ users: User[]; totalUsers: number }> => {
    const res = await api.get<{ users: User[]; totalUsers: number }>(`/users`, {
      params: {
        page,
        limit,
        search,
        role: role?.toUpperCase(),
        isActive,
      },
    });

    return res.data;
  },

  getUserById: async (
    id: string | undefined,
  ): Promise<UserWithFollowStatus> => {
    const res = await api.get<UserWithFollowStatus>(`/users/${id}`);

    return res.data;
  },

  getAllUserPhotos: async (
    userID: string,
    page: number = 1,
    limit: number = 12,
    search?: string,
    isPublic?: boolean,
  ): Promise<{ photos: Photo[]; totalPhotos: number }> => {
    const res = await api.get<{ photos: Photo[]; totalPhotos: number }>(
      `/users/${userID}/photos`,
      {
        params: {
          page,
          limit,
          search,
          isPublic,
        },
      },
    );
    return res.data;
  },

  getAllUserAlbums: async (userId: string | undefined): Promise<Album[]> => {
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

  updateUserProfile: async (data: ProfilePayload): Promise<User> => {
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
      withCredentials: true,
    });

    return res.data;
  },

  updateUserProfileByAdmin: async (
    id: string,
    data: ProfilePayload,
  ): Promise<User> => {
    const res = await api.patch<User>(`/users/${id}`, data);
    return res.data;
  },

  updateUserAvatarByAdmin: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.patch<User>(`/users/${id}/avatar`, formData, {
      withCredentials: true,
    });

    return res.data;
  },

  updateUserIsActiveByAdmin: async (
    id: string,
    isActive: boolean,
  ): Promise<User> => {
    const res = await api.patch<User>(`/users/${id}/isActive`, { isActive });
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

  getTargetUserUserPhotos: async (
    userId: string | undefined,
  ): Promise<Photo[]> => {
    const res = await api.get<Photo[]>(`/users/${userId}/photos`);
    return res.data;
  },

  getTargetUserUserAlbums: async (
    userId: string | undefined,
  ): Promise<Album[]> => {
    const res = await api.get<Album[]>(`/users/${userId}/albums`);
    return res.data;
  },

  getTargetUserFollowings: async (
    userId: string | undefined,
  ): Promise<UserWithFollowStatus[]> => {
    const res = await api.get<UserWithFollowStatus[]>(
      `/users/${userId}/followings`,
    );
    return res.data;
  },

  getTargetUserFollowers: async (
    userId: string | undefined,
  ): Promise<UserWithFollowStatus[]> => {
    const res = await api.get<UserWithFollowStatus[]>(
      `/users/${userId}/followers`,
    );
    return res.data;
  },

  deleteUserByAdmin: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};
