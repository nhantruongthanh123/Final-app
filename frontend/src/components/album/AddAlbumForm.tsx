import RemoveablePhoto from "@/components/photo/RemovablePhoto";
import { useChangeAlbum } from "@/hooks/album/useChangeAlbum";
import { albumSchema, type AlbumPayload } from "@/schemas/album.schema";
import type { newPhotoPreview } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const AddAlbumForm = ({ backlink }: { backlink: string }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newPhotos, setNewPhotos] = useState<newPhotoPreview[]>([]);
  const albumMutation = useChangeAlbum();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AlbumPayload>({
    resolver: zodResolver(albumSchema),
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

  const onSubmit = async (data: AlbumPayload) => {
    await toast.promise(
      albumMutation.mutateAsync({
        action: "create",
        data: {
          title: data.title,
          description: data.description,
          isPublic: data.isPublic,
          files: data.files,
        },
      }),
      {
        loading: "Creating album...",
        success: () => {
          navigate(backlink);
          return "Album created successfully!";
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            console.log(error);
            return error.response?.data?.message;
          }
        },
      },
    );
  };

  return (
    <form
      className="flex flex-col w-full p-4 md:p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PageHeader title="Add Album" backlink={backlink} />

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
                {...register("title")}
                placeholder="Lorem ipsum dolor sit amet..."
              />
              {errors.title?.message && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label className="font-bold text-slate-700">Sharing mode</Label>
              <Select
                defaultValue="Public"
                onValueChange={(value) =>
                  setValue("isPublic", value === "Public", {
                    shouldValidate: true,
                  })
                }
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddAlbumForm;
