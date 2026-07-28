import { PhotoService } from "@/services/photo.service";
import type { PaginatedResponse } from "@/types/api";
import type { PhotoWithMeta } from "@/types/photo";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 20;
type PhotoFeedResponse = PaginatedResponse<PhotoWithMeta>;

export function usePhotoFeed(searchParam?: string) {
  return useInfiniteQuery<PhotoFeedResponse, Error>({
    queryKey: ["photos", "feed", searchParam],
    queryFn: async ({ pageParam }) => {
      return PhotoService.getFeedPhotos(
        pageParam as number,
        LIMIT,
        searchParam,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}
