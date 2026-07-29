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
      queryClient.invalidateQueries({ queryKey: ["photos", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["photos", "discover"] });

      queryClient.invalidateQueries({ queryKey: ["albums", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["albums", "discover"] });
    },

    onError: (error) => {
      console.error("Failed to follow user:", error);
    },
  });
};
