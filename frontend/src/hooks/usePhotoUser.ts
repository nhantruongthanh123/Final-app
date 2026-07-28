import { UserService } from "@/services/user.service";
import type { Photo } from "@/types/photo";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;
type PhotoUserResponse = {
  photos: Photo[];
  totalPhotos: number;
};

export function usePhotoUser(
  userId: string | undefined,
  searchParam?: string,
  isPublic?: boolean,
) {
  return useInfiniteQuery<PhotoUserResponse, Error>({
    queryKey: ["photos", userId, searchParam, isPublic],
    queryFn: async ({ pageParam }) => {
      if (!userId) throw new Error("No user ID");
      return UserService.getAllUserPhotos(
        userId,
        pageParam as number,
        LIMIT,
        searchParam,
        isPublic,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, p) => sum + p.photos.length,
        0,
      );
      return totalFetched < lastPage.totalPhotos
        ? allPages.length + 1
        : undefined;
    },
  });
}
