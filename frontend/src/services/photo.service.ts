import type { PhotoPayload, UpdatePhotoPayload } from "@/schemas/photo.schema";
import { api } from "@/services/axiosClient";
import type { Photo, PhotoFeed } from "@/types/photo";

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

  createPhoto: async (data: PhotoPayload) => {
    const formData = new FormData();
    if (data.file) {
      formData.append("photo", data.file);
    }
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isPublic", String(data.isPublic));
    const res = await api.post<Photo>("/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  },

  deletePhoto: async (id: string) => {
    await api.delete(`/photos/${id}`);
  },

  updatePhoto: async (id: string, data: UpdatePhotoPayload) => {
    const formData = new FormData();
    if (data.file) {
      formData.append("photo", data.file);
    }
    if (data.title !== undefined) {
      formData.append("title", data.title);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description);
    }
    if (data.isPublic !== undefined) {
      formData.append("isPublic", String(data.isPublic));
    }

    const res = await api.patch<Photo>(`/photos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data;
  },

  getFeedPhotos: async () => {
    const res = await api.get<{ feed: PhotoFeed[]; total: number }>(
      "/photos/feed",
    );
    return res.data;
  },

  getDiscoverPhotos: async () => {
    const res = await api.get<{ discover: PhotoFeed[]; total: number }>(
      "/photos/discover",
    );
    return res.data;
  },
};
