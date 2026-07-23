import { useState } from "react";

import AlbumsFeed from "@/components/album/AlbumsFeed";
import PhotosFeed from "@/components/photo/PhotosFeed";
import TagToggle from "@/components/shared/TagToggle";

function Feed() {
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-white dark:bg-black ">
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />
      </div>

      {isPhotoView ? <PhotosFeed /> : <AlbumsFeed />}
    </div>
  );
}

export default Feed;
