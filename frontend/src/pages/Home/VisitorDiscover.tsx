import { useState } from "react";

import AlbumsDiscover from "@/components/album/AlbumsDiscover";
import PhotosDiscover from "@/components/photo/PhotosDiscover";
import TagToggle from "@/components/shared/TagToggle";

function VisitorDiscover() {
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-white dark:bg-black ">
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />
      </div>

      {isPhotoView ? <PhotosDiscover /> : <AlbumsDiscover />}
    </div>
  );
}

export default VisitorDiscover;
