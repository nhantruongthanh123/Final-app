import type { AlbumPayload } from "@/schemas/album.schema";
import { api } from "@/services/axiosClient";
import type { Album, AlbumWithMeta } from "@/types/album";

export const AlbumService = {
  getAllAlbums: async (
    currentPage: number = 1,
    limit: number = 12,
    search?: string,
    isPublic?: boolean,
  ): Promise<{ albums: Album[]; totalAlbums: number }> => {
    const res = await api.get<{ albums: Album[]; totalAlbums: number }>(
      "/albums/admin",
      {
        params: {
          page: currentPage,
          limit,
          search,
          isPublic,
        },
      },
    );

    return res.data;
  },
  getAlbumById: async (id: string): Promise<Album> => {
    const res = await api.get<Album>(`/albums/${id}`);

    return res.data;
  },

  getFeedAlbums: async (page?: number, limit?: number) => {
    const res = await api.get<{ items: AlbumWithMeta[]; total: number }>(
      "/albums/feed",
      {
        params: {
          page,
          limit,
        },
      },
    );
    return res.data;
  },

  getDiscoverAlbums: async (page?: number, limit?: number) => {
    const res = await api.get<{ items: AlbumWithMeta[]; total: number }>(
      "/albums/discover",
      {
        params: {
          page,
          limit,
        },
      },
    );
    return res.data;
  },

  createAlbum: async (data: AlbumPayload) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isPublic", String(data.isPublic));

    data.files.forEach((file) => {
      formData.append("photos", file);
    });

    const res = await api.post<Album>("/albums", formData, {
      withCredentials: true,
      timeout: 15000,
    });

    return res.data;
  },

  updateAlbum: async (
    id: string,
    data: {
      title: string;
      description: string;
      isPublic: boolean;
      files: File[];
      removedPhotoIds: string[];
    },
  ) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isPublic", String(data.isPublic));

    data.files.forEach((file) => {
      formData.append("photos", file);
    });

    formData.append("removedPhotoIds", JSON.stringify(data.removedPhotoIds));

    const res = await api.patch<Album>(`/albums/${id}`, formData, {
      withCredentials: true,
      timeout: 15000,
    });

    return res.data;
  },

  deleteAlbum: async (id: string) => {
    const res = await api.delete(`/albums/${id}`, { withCredentials: true });
    return res.data;
  },
};
