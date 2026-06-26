import { ArrowBigLeft, X } from "lucide-react";
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
import { useParams, Link } from "react-router-dom";

const EditPhoto = () => {
  const { id } = useParams<{ id: string }>();
  const photo = mockPhotos.find((photo) => String(photo.id) === id);

  return (
    <div className="flex flex-col w-full m-4 md:m-6">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Edit Photo</h1>
        <Link to="/photos">
          <Button
            variant="ghost"
            className="ml-auto bg-indigo-50 hover:bg-indigo-100"
          >
            <ArrowBigLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

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
              <Select defaultValue="public">
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
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

        <div className="flex flex-row ">
          <Button
            variant="default"
            className=" bg-indigo-500 hover:bg-indigo-600 text-white mt-4"
          >
            Save Changes
          </Button>

          <Button
            variant="destructive"
            className="ml-4 bg-red-500 hover:bg-red-600 text-white mt-4"
          >
            Delete Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhoto;
