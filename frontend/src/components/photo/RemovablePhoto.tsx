import { X } from "lucide-react";

const RemovablePhoto = ({ imgURL }: { imgURL: string }) => {
  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <img
        src={imgURL}
        alt="Image"
        className="rounded-xl w-full h-full object-cover block"
      />
      <X className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8 cursor-pointer" />
    </div>
  );
};

export default RemovablePhoto;
