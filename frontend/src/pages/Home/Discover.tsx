import { useState } from "react";

import AlbumsDiscover from "@/components/album/AlbumsDiscover";
import PhotosDiscover from "@/components/photo/PhotosDiscover";
import TagToggle from "@/components/shared/TagToggle";

function Discover() {
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

        {isPhotoView ? <PhotosDiscover /> : <AlbumsDiscover />}
      </div>
    </div>
  );
}

export default Discover;
