import { cn } from "@/lib/utils";

const TagToggle = ({
  isPhoto,
  setIsPhoto,
}: {
  isPhoto: boolean;
  setIsPhoto: (isPhoto: boolean) => void;
}) => {
  return (
    <div className="flex justify-center items-center font-bold pt-4 pb-4">
      <button
        className={cn(
          "p-2 border-2 border-indigo-800",
          isPhoto ? "bg-indigo-800 text-white" : "bg-white text-indigo-800",
        )}
        onClick={() => setIsPhoto(true)}
      >
        PHOTO
      </button>
      <button
        className={cn(
          "p-2 border-2 border-indigo-800",
          !isPhoto ? "bg-indigo-800 text-white" : "bg-white text-indigo-800",
        )}
        onClick={() => setIsPhoto(false)}
      >
        ALBUM
      </button>
    </div>
  );
};

export default TagToggle;
