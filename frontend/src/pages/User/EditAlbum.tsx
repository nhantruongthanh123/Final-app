import { ArrowBigLeft, Plus } from "lucide-react";
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
import { mockAlbums } from "@/datas/albumData";
import { useParams, Link } from "react-router-dom";
import RemoveablePhoto from "@/components/photo/RemovablePhoto";

const EditAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const album = mockAlbums.find((album) => album.id === id);

  return (
    <div className="flex flex-col w-full m-4 md:m-6">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Edit Album</h1>
        <Link to="/albums">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {album?.imgURLs.map((imgURL, index) => (
            <RemoveablePhoto key={index} imgURL={imgURL} />
          ))}

          <button
            className="flex items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400 cursor-pointer"
            onClick={() => {}}
          >
            <Plus className="w-10 h-10" strokeWidth={3} />
          </button>
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
            Delete Album
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAlbum;
