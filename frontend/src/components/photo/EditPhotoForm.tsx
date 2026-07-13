import PageHeader from "@/components/shared/PageHeader";
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
import { PhotoService } from "@/services/photoService";
import type { Photo } from "@/types/photo";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const EditPhotoForm = ({ id, backlink }: { id: string; backlink: string }) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewPhotoUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = async () => {
    if (!previewPhotoUrl && !selectedFile) {
      toast.error("Image is required. Please upload a photo.");
      return;
    }

    if (!photo) {
      toast.error("Photo not found.");
      return;
    }

    try {
      toast.promise(
        PhotoService.updatePhoto(photo.id, {
          file: selectedFile ?? undefined,
          title,
          description,
          isPublic,
        }),
        {
          loading: "Updating photo...",
          success: (updatedPhoto) => {
            setPreviewPhotoUrl(updatedPhoto.photoUrl);
            setSelectedFile(null);
            return "Update photo successfully!";
          },
          error: "Failed to update photo",
        },
      );
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      toast.promise(PhotoService.deletePhoto(photo!.id), {
        loading: "Deleting photo...",
        success: () => {
          window.location.href = backlink;
          return "Delete photo successfully!";
        },
        error: "Failed to delete photo",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const data = await PhotoService.getPhotoById(id);
        setPhoto(data);
        setTitle(data.title);
        setDescription(data.description);
        setIsPublic(data.isPublic);
        setPreviewPhotoUrl(data.photoUrl);
        console.log("Fetched photo:", data);
      } catch (error) {
        console.error("Error fetching photo:", error);
        toast.error("Failed to fetch photo");
      }
    };

    fetchPhoto();
  }, [id]);

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <PageHeader title="Edit Photo" backlink={backlink} />

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label className="font-bold text-slate-700">Sharing mode</Label>
              <Select
                defaultValue="Public"
                value={isPublic ? "Public" : "Private"}
                onValueChange={(value) => setIsPublic(value === "Public")}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {previewPhotoUrl ? (
          <div className="relative w-full md:w-lg h-auto mt-4 rounded-xl object-cover block">
            <img
              src={previewPhotoUrl}
              alt={photo?.title}
              className="rounded-xl w-full h-auto object-cover"
            />
            <X
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8 cursor-pointer"
            />
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
          </div>
        )}

        <div className="flex flex-row mt-6 gap-6">
          <Button
            variant="default"
            className=" bg-indigo-500 hover:bg-indigo-600 text-white "
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>

          <Button
            variant="ghost"
            className=" bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDeletePhoto}
          >
            Delete Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoForm;
