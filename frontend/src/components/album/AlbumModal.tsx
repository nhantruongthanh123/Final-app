import type { AlbumModalProps } from "@/types/album";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const AlbumModal = ({
  isOpen,
  onClose,
  title,
  description,
  photos,
}: AlbumModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((pre) => (pre + 1) % photos.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((pre) => (pre - 1 + photos.length) % photos.length);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-between items-center p-4">
          <div className="w-full flex items-center mb-4 justify-end relative shrink-0">
            <h2 className="font-bold text-lg text-black absolute left-1/2 transform -translate-x-1/2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black font-bold text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="w-full bg-gray-100 flex justify-center max-h-[60vh] items-center px-4 select-none">
            <div
              className="cursor-pointer shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </div>

            <div className="relative flex-1 flex justify-center items-center h-full mx-4">
              <img
                src={photos[currentImageIndex].photoUrl}
                alt={title}
                className="max-w-full object-contain max-h-[60vh]"
              />

              <div className="absolute bottom-4 flex items-center gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "w-6 bg-indigo-600/80"
                        : "w-2 bg-slate-500/50 hover:bg-slate-500/80"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div
              className="cursor-pointer shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
              onClick={handleNextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 text-sm text-gray-700 leading-relaxed overflow-y-auto shrink-0">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumModal;
