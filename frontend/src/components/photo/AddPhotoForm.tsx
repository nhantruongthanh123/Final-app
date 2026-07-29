import PageHeader from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { photoSchema, type PhotoPayload } from "@/schemas/photo.schema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

import { useChangePhoto } from "@/hooks/photo/useChangePhoto";
import axios from "axios";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const AddPhotoForm = ({ backlink }: { backlink: string }) => {
  const navigate = useNavigate();
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoMutation = useChangePhoto();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PhotoPayload>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      file: undefined,
    },
    criteriaMode: "all",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setValue("file", file, { shouldValidate: true });
    setPreviewPhotoUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPreviewPhotoUrl(null);

    setValue("file", undefined, { shouldValidate: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PhotoPayload) => {
    await toast.promise(photoMutation.mutateAsync({ action: "create", data }), {
      loading: "Saving photo...",
      success: () => {
        navigate("/photos");
        return "Photo saved successfully!";
      },
      error: (err) => {
        navigate(backlink);
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          return err.response.data.message;
        }
        return "An unexpected error occurred. Please try again.";
      },
    });
  };

  return (
    <form
      className="flex flex-col w-full p-4 md:p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PageHeader title="Add Photo" backlink={backlink} />

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
                placeholder="Enter photo title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label htmlFor="isPublic" className="font-bold text-slate-700">
                Sharing mode
              </Label>
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? "Public" : "Private"}
                    onValueChange={(value) =>
                      field.onChange(value === "Public")
                    }
                  >
                    <SelectTrigger className="w-45" id="isPublic">
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 gap-1.5">
            <Label htmlFor="description" className="font-bold text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              className="h-27 resize-none"
              {...register("description")}
              placeholder="Enter photo description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {previewPhotoUrl ? (
          <div className="relative w-full md:w-lg h-auto mt-4 rounded-xl object-cover block">
            <img
              src={previewPhotoUrl}
              alt={"Preview"}
              className="rounded-xl w-full h-auto object-cover"
            />
            <X
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8 cursor-pointer"
            />

            {errors.file && (
              <p className="pt-4 text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>
        ) : (
          <div className="relative w-full md:w-lg h-auto mt-4 rounded-xl object-cover block">
            <label className="flex items-center justify-center w-64 h-40 border-2 border-dashed rounded-lg cursor-pointer">
              <span> Upload new image</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {errors.file && (
              <p className="pt-4 text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-row mt-6 gap-6">
          <Button
            variant="default"
            className=" bg-indigo-500 hover:bg-indigo-600 text-white "
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

export default AddPhotoForm;
