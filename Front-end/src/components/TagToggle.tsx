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
        className={`p-2 border-2 border-indigo-800 ${
          isPhoto ? "text-white bg-indigo-800" : "text-indigo-800 bg-white"
        }`}
        onClick={() => setIsPhoto(true)}
      >
        PHOTO
      </button>
      <button
        className={`p-2 border-2 border-indigo-800 ${
          !isPhoto ? "text-white bg-indigo-800" : "text-indigo-800 bg-white"
        }`}
        onClick={() => setIsPhoto(false)}
      >
        ALBUM
      </button>
    </div>
  );
};

export default TagToggle;
