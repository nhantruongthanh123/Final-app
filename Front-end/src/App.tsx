import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Photo from "./components/Photo";
import PhotoModal from "./components/PhotoModal";
import TagToggle from "./components/TagToggle";
import mockPhotos from "./mockdata";
import type { PhotoData } from "./types/photo";

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  return (
    <div className="flex flex-col min-h-screen">
      <Header name="Ronaldo Messi" />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div>
          <TagToggle />
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Photo photoData={photo} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        imgURL={selectedPhoto?.imgURL || ""}
      />
    </div>
  );
}

export default App;
