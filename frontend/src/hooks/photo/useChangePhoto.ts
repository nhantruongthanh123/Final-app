import type { PhotoPayload, UpdatePhotoPayload } from "@/schemas/photo.schema";
import { PhotoService } from "@/services/photo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PhotoMutationInput =
  | { action: "create"; data: PhotoPayload }
  | { action: "update"; id: string; data: UpdatePhotoPayload }
  | { action: "delete"; id: string };

export const useChangePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PhotoMutationInput) => {
      switch (input.action) {
        case "create":
          return PhotoService.createPhoto(input.data);
        case "update":
          return PhotoService.updatePhoto(input.id, input.data);
        case "delete":
          return PhotoService.deletePhoto(input.id);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["photos", data.userId] });

      queryClient.invalidateQueries({ queryKey: ["photos", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["photos", "discover"] });
    },

    onError: (error) => {
      console.error("Failed to save photo:", error);
    },
  });
};
