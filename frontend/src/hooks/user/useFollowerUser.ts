import { UserService } from "@/services/user.service";
import type { UserWithFollowStatus } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;
type UserFollowerResponse = {
  followers: UserWithFollowStatus[];
  totalFollowers: number;
};

export function useFollowerUser(
  userId: string | undefined,
  searchParam?: string,
) {
  return useInfiniteQuery<UserFollowerResponse, Error>({
    queryKey: ["followers", userId, searchParam],
    queryFn: async ({ pageParam }) => {
      if (!userId) throw new Error("User ID is required");
      return UserService.getAllUserFollowers(
        userId,
        pageParam as number,
        LIMIT,
        searchParam,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, p) => sum + p.followers.length,
        0,
      );
      return totalFetched < lastPage.totalFollowers
        ? allPages.length + 1
        : undefined;
    },
    enabled: !!userId,
  });
}
