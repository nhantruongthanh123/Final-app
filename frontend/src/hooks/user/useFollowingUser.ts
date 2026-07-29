import { UserService } from "@/services/user.service";
import type { UserWithFollowStatus } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 12;
type UserFollowingResponse = {
  followings: UserWithFollowStatus[];
  totalFollowings: number;
};

export function useFollowingUser(
  userId: string | undefined,
  searchParam?: string,
) {
  return useInfiniteQuery<UserFollowingResponse, Error>({
    queryKey: ["followings", userId, searchParam],
    queryFn: async ({ pageParam }) => {
      if (!userId) throw new Error("User ID is required");
      return UserService.getAllUserFollowings(
        userId,
        pageParam as number,
        LIMIT,
        searchParam,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, p) => sum + p.followings.length,
        0,
      );
      return totalFetched < lastPage.totalFollowings
        ? allPages.length + 1
        : undefined;
    },
    enabled: !!userId,
  });
}
