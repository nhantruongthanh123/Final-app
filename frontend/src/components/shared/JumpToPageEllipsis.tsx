import { useState } from "react";
import { toast } from "sonner";
import { PaginationEllipsis } from "../ui/pagination";

interface JumpToPageProps {
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const JumpToPageEllipsis = ({
  totalPages,
  setCurrentPage,
}: JumpToPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleJump = () => {
    const targetPage = parseInt(inputValue, 10);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
      setCurrentPage(targetPage);
    } else {
      toast.error(
        `Please enter a valid page number between 1 and ${totalPages}.`,
      );
    }
    setIsEditing(false);
    setInputValue("");
  };

  if (isEditing) {
    return (
      <input
        type="number"
        min={1}
        max={totalPages}
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleJump}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleJump();
          if (e.key === "Escape") setIsEditing(false);
        }}
        className="w-12 h-9 text-center text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="..."
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title="Jump to page"
    >
      <PaginationEllipsis />
    </button>
  );
};
