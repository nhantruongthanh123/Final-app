import { UserService } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isCurrentlyFollowing,
    }: {
      userId: string;
      isCurrentlyFollowing: boolean;
    }) => {
      if (isCurrentlyFollowing) {
        return await UserService.unfollowUser(userId);
      } else {
        return await UserService.followUser(userId);
      }
    },

    onSuccess: () => {
      // This will invalidate ANY query that starts with these keys
      // so you don't have to worry about the exact search query strings
      queryClient.invalidateQueries({ queryKey: ["photos", "discover"] });
      queryClient.invalidateQueries({ queryKey: ["photos", "feed"] });
    },

    onError: (error) => {
      console.error("Failed to follow user:", error);
    },
  });
};
