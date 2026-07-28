import { UserService } from "@/services/user.service";
import type { Album } from "@/types/album";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;
type AlbumUserResponse = {
  albums: Album[];
  totalAlbums: number;
};

export function useAlbumUser(
  userId: string | undefined,
  searchParam?: string,
  isPublic?: boolean,
) {
  return useInfiniteQuery<AlbumUserResponse, Error>({
    queryKey: ["albums", userId, searchParam, isPublic],
    queryFn: async ({ pageParam }) => {
      if (!userId) throw new Error("No user ID");
      return UserService.getAllUserAlbums(
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
        (sum, p) => sum + p.albums.length,
        0,
      );
      return totalFetched < lastPage.totalAlbums
        ? allPages.length + 1
        : undefined;
    },
  });
}
