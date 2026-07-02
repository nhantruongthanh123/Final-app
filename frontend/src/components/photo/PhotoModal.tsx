import type { PhotoModalProps } from "../../types/photo";

const PhotoModal = ({
  title,
  description,
  imgURL,
  isOpen,
  onClose,
}: PhotoModalProps) => {
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
          <div className="w-full flex items-center mb-4 justify-end relative">
            <h2 className="font-bold text-lg text-black absolute left-1/2 transform -translate-x-1/2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black font-bold text-2xl leading-none"
            >
              &times; {/* This is the HTML code for a nice 'X' */}
            </button>
          </div>

          <div className="w-full bg-gray-100 flex justify-center max-h-[60vh]">
            <img
              src={imgURL}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-4 text-sm text-gray-700 leading-relaxed overflow-y-auto">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
