import { AlbumService } from "@/services/album.service";
import type { AlbumWithMeta } from "@/types/album";
import type { PaginatedResponse } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";

type AlbumDiscoverResponse = PaginatedResponse<AlbumWithMeta>;

const LIMIT = 12;

export function useAlbumDiscover(searchParam?: string) {
  return useInfiniteQuery<AlbumDiscoverResponse, Error>({
    queryKey: ["albums", "discover", searchParam],
    queryFn: async ({ pageParam }) => {
      return AlbumService.getDiscoverAlbums(
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
