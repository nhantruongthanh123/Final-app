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
          "p-2 border-2 border-brand ",
          isPhoto
            ? "bg-brand text-white"
            : "bg-white text-brand dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        )}
        onClick={() => setIsPhoto(true)}
      >
        PHOTO
      </button>
      <button
        className={cn(
          "p-2 border-2 border-brand",
          !isPhoto
            ? "bg-brand text-white"
            : "bg-white text-brand dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        )}
        onClick={() => setIsPhoto(false)}
      >
        ALBUM
      </button>
    </div>
  );
};

export default TagToggle;
