import type { AlbumPayload } from "@/schemas/album.schema";
import { AlbumService } from "@/services/album.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AlbumMutationInput =
  | { action: "create"; data: AlbumPayload }
  | {
      action: "update";
      id: string;
      data: {
        title: string;
        description: string;
        isPublic: boolean;
        files: File[];
        removedPhotoIds: string[];
      };
    }
  | { action: "delete"; id: string };

export const useChangeAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AlbumMutationInput) => {
      switch (input.action) {
        case "create":
          return AlbumService.createAlbum(input.data);
        case "update":
          return AlbumService.updateAlbum(input.id, input.data);
        case "delete":
          return AlbumService.deleteAlbum(input.id);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["albums", data.userId] });

      queryClient.invalidateQueries({ queryKey: ["albums", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["albums", "discover"] });
    },

    onError: (error) => {
      console.error("Failed to save album:", error);
    },
  });
};
