import { api } from "@/services/axiosClient";
import type { Photo } from "@/types/photo";

export const PhotoService = {
  getAllPhotos: async (
    page: number,
    limit: number,
  ): Promise<{ photos: Photo[]; totalPhotos: number }> => {
    const res = await api.get<{ photos: Photo[]; totalPhotos: number }>(
      "/photos",
      {
        params: {
          page,
          limit,
        },
      },
    );

    return res.data;
  },
  getPhotoById: async (id: string): Promise<Photo> => {
    const res = await api.get<Photo>(`/photos/${id}`);

    return res.data;
  },
};
