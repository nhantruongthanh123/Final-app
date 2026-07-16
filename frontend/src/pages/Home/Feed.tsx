import { useState } from "react";

import AlbumsFeed from "@/components/album/AlbumsFeed";
import PhotosFeed from "@/components/photo/PhotosFeed";
import TagToggle from "@/components/shared/TagToggle";

function Feed() {
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

        {isPhotoView ? <PhotosFeed /> : <AlbumsFeed />}
      </div>
    </div>
  );
}

export default Feed;
