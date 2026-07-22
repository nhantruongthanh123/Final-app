import type { AlbumPayload } from "@/schemas/album.schema";
import { api } from "@/services/axiosClient";
import type { Album, AlbumFeed } from "@/types/album";

export const AlbumService = {
  getAllAlbums: async (
    currentPage: number = 1,
    limit: number = 12,
  ): Promise<{ albums: Album[]; totalAlbums: number }> => {
    const res = await api.get<{ albums: Album[]; totalAlbums: number }>(
      "/albums",
      {
        params: {
          page: currentPage,
          limit,
        },
      },
    );

    return res.data;
  },
  getAlbumById: async (id: string): Promise<Album> => {
    const res = await api.get<Album>(`/albums/${id}`);

    return res.data;
  },

  getFeedAlbums: async () => {
    const res = await api.get<{ feed: AlbumFeed[]; total: number }>(
      "/albums/feed",
    );
    return res.data;
  },

  getDiscoverAlbums: async () => {
    const res = await api.get<{ discover: AlbumFeed[]; total: number }>(
      "/albums/discover",
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
