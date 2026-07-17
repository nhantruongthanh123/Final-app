import RemoveablePhoto from "@/components/photo/RemovablePhoto";
import { AlbumService } from "@/services/album.service";
import type { newPhotoPreview } from "@/types/album";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
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
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sharingMode, setSharingMode] = useState<string>("Public");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newPhotos, setNewPhotos] = useState<newPhotoPreview[]>([]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newPhotoPreviews: newPhotoPreview[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewPhotos((prev) => [...prev, ...newPhotoPreviews]);
  };

  const handleRemoveNewPhoto = (photoId: string) => {
    setNewPhotos((prev) => {
      const target = prev.find((p) => p.id === photoId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== photoId);
    });
  };

  const handleSaveChanges = async () => {
    if (!title.trim()) {
      toast.error("Title is required", {
        duration: 3000,
      });
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required", {
        duration: 3000,
      });
      return;
    }
    if (newPhotos.length === 0) {
      toast.error("At least one photo is required", {
        duration: 3000,
      });
      return;
    }
    if (newPhotos.length > 25) {
      toast.error("You can only upload up to 25 photos", {
        duration: 3000,
      });
      return;
    }

    toast.promise(
      AlbumService.createAlbum({
        title,
        description,
        isPublic: sharingMode === "Public",
        files: newPhotos.map((p) => p.file),
      }),
      {
        loading: "Creating album...",
        success: () => {
          navigate(backlink);
          return "Album created successfully!";
        },
        error: "Failed to create album.",
      },
    );
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
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
                placeholder="Lorem ipsum dolor sit amet..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label className="font-bold text-slate-700">Sharing mode</Label>
              <Select
                defaultValue={sharingMode}
                onValueChange={(value) =>
                  setSharingMode(value as "Public" | "Private")
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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

        <div className="flex flex-row mt-6 gap-6">
          <Button
            variant="default"
            className=" bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAlbumForm;
