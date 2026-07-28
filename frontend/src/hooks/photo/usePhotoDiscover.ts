import { PhotoService } from "@/services/photo.service";
import type { PaginatedResponse } from "@/types/api";
import type { PhotoWithMeta } from "@/types/photo";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 20;
type PhotoDiscoverResponse = PaginatedResponse<PhotoWithMeta>;

export function usePhotoDiscover(searchParam?: string) {
  return useInfiniteQuery<PhotoDiscoverResponse, Error>({
    queryKey: ["photos", "discover", searchParam],
    queryFn: async ({ pageParam }) => {
      return await PhotoService.getDiscoverPhotos(
        pageParam as number,
        LIMIT,
        searchParam as string | undefined,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}
