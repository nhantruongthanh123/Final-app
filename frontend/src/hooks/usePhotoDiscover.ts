import { PhotoService } from "@/services/photo.service";
import type { PaginatedResponse } from "@/types/api";
import type { PhotoWithMeta } from "@/types/photo";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 20;
type PhotoDiscoverResponse = PaginatedResponse<PhotoWithMeta>;

export function usePhotoDiscover() {
  return useInfiniteQuery<PhotoDiscoverResponse, Error>({
    queryKey: ["photos", "discover"],
    queryFn: async ({ pageParam }) => {
      return await PhotoService.getDiscoverPhotos(pageParam as number, LIMIT);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}
