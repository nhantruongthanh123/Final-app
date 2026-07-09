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

  getFeedPhotos: async () => {
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
};
