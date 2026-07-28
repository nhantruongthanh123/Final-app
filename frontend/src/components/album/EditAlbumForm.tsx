import RemoveablePhoto from "@/components/photo/RemovablePhoto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useChangeAlbum } from "@/hooks/useChangeAlbum";
import { editAlbumSchema, type EditAlbumPayload } from "@/schemas/album.schema";
import { AlbumService } from "@/services/album.service";
import type { AlbumImage, newPhotoPreview } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../shared/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const EditAlbumForm = ({ id, backlink }: { id: string; backlink: string }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [existingPhotos, setExistingPhotos] = useState<AlbumImage[]>([]);
  const [newPhotos, setNewPhotos] = useState<newPhotoPreview[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const [sharingMode, setSharingMode] = useState<"Public" | "Private">(
    "Public",
  );
  const albumMutation = useChangeAlbum();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditAlbumPayload>({
    resolver: zodResolver(editAlbumSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      files: [],
    },
    criteriaMode: "all",
  });

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newPhotoPreviews: newPhotoPreview[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewPhotos((prev) => {
      const nextPhotos = [...prev, ...newPhotoPreviews];
      setValue(
        "files",
        nextPhotos.map((photo) => photo.file),
        { shouldValidate: true },
      );
      return nextPhotos;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExistingPhoto = (photoId: string) => {
    setExistingPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    setRemovedPhotoIds((prev) => [...prev, photoId]);
  };

  const handleRemoveNewPhoto = (photoId: string) => {
    setNewPhotos((prev) => {
      const removedPhoto = prev.find((photo) => photo.id === photoId);
      if (removedPhoto) URL.revokeObjectURL(removedPhoto.previewUrl);

      const nextPhotos = prev.filter((photo) => photo.id !== photoId);
      setValue(
        "files",
        nextPhotos.map((photo) => photo.file),
        { shouldValidate: true },
      );

      return nextPhotos;
    });
  };

  const onSubmit = async (data: EditAlbumPayload) => {
    const totalPhotos = existingPhotos.length + newPhotos.length;

    if (totalPhotos === 0) {
      setError("files", {
        type: "manual",
        message: "At least one photo is required to save this album.",
      });
      return;
    }

    if (totalPhotos > 25) {
      setError("files", {
        type: "manual",
        message: "You can only upload up to 25 photos.",
      });
      return;
    }

    clearErrors("files");

    await toast.promise(
      albumMutation.mutateAsync({
        action: "update",
        id,
        data: {
          title: data.title,
          description: data.description,
          isPublic: data.isPublic,
          files: data.files ?? [],
          removedPhotoIds,
        },
      }),
      {
        loading: "Saving changes...",
        success: () => {
          navigate(backlink);
          return "Changes saved successfully!";
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            console.log(error);
            return error.response?.data?.message;
          }

          return "Failed to save changes.";
        },
      },
    );
  };

  const handleDeleteAlbum = async () => {
    try {
      await toast.promise(albumMutation.mutateAsync({ action: "delete", id }), {
        loading: "Deleting album...",
        success: () => {
          navigate(backlink);
          return "Delete album successfully!";
        },
        error: "Failed to delete album",
      });
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album");
    }
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await AlbumService.getAlbumById(id);
        setExistingPhotos(albumData.photos);
        setSharingMode(albumData.isPublic ? "Public" : "Private");
        reset({
          title: albumData.title,
          description: albumData.description || "",
          isPublic: albumData.isPublic,
          files: [],
        });
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    fetchAlbum();
  }, [id, reset]);

  return (
    <form
      className="flex flex-col w-full p-4 md:p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PageHeader title="Edit Album" backlink={backlink} />

      <div className="border border-gray-200 rounded-xl flex flex-col">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex flex-col w-full md:w-1/2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title" className="font-bold text-slate-700">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Lorem ipsum dolor sit amet..."
                {...register("title")}
              />
              {errors.title?.message && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label className="font-bold text-slate-700">Sharing mode</Label>
              <Select
                value={sharingMode}
                onValueChange={(value) => {
                  const nextMode = value as "Public" | "Private";
                  setSharingMode(nextMode);
                  setValue("isPublic", nextMode === "Public", {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  side="bottom"
                  sideOffset={4}
                >
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 gap-1.5">
            <Label htmlFor="description" className="font-bold text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Lorem ipsum dolor sit amet..."
              className="h-27 resize-none"
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {existingPhotos.map((photo) => (
            <RemoveablePhoto
              key={photo.id}
              imgURL={photo.photoUrl}
              handleRemove={() => handleRemoveExistingPhoto(photo.id)}
            />
          ))}

          {newPhotos.map((photo) => (
            <RemoveablePhoto
              key={photo.id}
              imgURL={photo.previewUrl}
              handleRemove={() => handleRemoveNewPhoto(photo.id)}
            />
          ))}

          <button
            type="button"
            className="flex items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400 cursor-pointer"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <Plus className="w-10 h-10" strokeWidth={3} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
              multiple
            />
          </button>
        </div>

        {errors.files?.message && (
          <p className="mt-4 text-sm text-red-500">{errors.files.message}</p>
        )}

        <div className="flex flex-row mt-6 gap-6">
          <Button
            variant="default"
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            Save Changes
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  Delete Album
                </Button>
              }
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this album?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All photos in this album will be
                  deleted permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAlbum}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </form>
  );
};

export default EditAlbumForm;
