import { X } from "lucide-react";
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
import { mockPhotos } from "@/datas/photoData";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";

const EditPhoto = () => {
  const { id } = useParams<{ id: string }>();
  const photo = mockPhotos.find((photo) => String(photo.id) === id);

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <PageHeader title="Edit Photo" backlink="/photos" />

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
              />
            </div>

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label className="font-bold text-slate-700">Sharing mode</Label>
              <Select defaultValue="Public">
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Friends">Friends Only</SelectItem>
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
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="relative w-full md:w-lg h-auto mt-4 rounded-xl object-cover block">
          <img src={photo?.imgURL} alt={photo?.title} className="rounded-xl" />
          <X className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8 cursor-pointer" />
        </div>

        <div className="flex flex-row mt-6 gap-6">
          <Button
            variant="default"
            className=" bg-indigo-500 hover:bg-indigo-600 text-white "
          >
            Save Changes
          </Button>

          <Button
            variant="ghost"
            className=" bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhoto;
