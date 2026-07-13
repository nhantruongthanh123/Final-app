import { useEffect, useState } from "react";

import Album from "@/components/album/Album";
import AlbumModal from "@/components/album/AlbumModal";
import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import { AlbumService } from "@/services/albumService";
import { PhotoService } from "@/services/photoService";
import type { AlbumFeed } from "@/types/album";
import type { PhotoFeed } from "@/types/photo";

function Feed() {
  const [feedPhotos, setFeedPhotos] = useState<PhotoFeed[]>([]);
  const [feedAlbums, setFeedAlbums] = useState<AlbumFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  // const handlePhotoLike = (photoId: string, newIsLiked: boolean) => {
  //   setFeedPhotos((prevPhotos) =>
  //     prevPhotos.map((photo) =>
  //       photo.id === photoId
  //         ? {
  //             ...photo,
  //             isLiked: newIsLiked,
  //             numLikes: newIsLiked ? photo.numLikes + 1 : photo.numLikes - 1,
  //           }
  //         : photo,
  //     ),
  //   );
  // };

  // const handleAlbumLike = (albumId: string, newIsLiked: boolean) => {
  //   setFeedAlbums((prevAlbums) =>
  //     prevAlbums.map((album) =>
  //       album.id === albumId
  //         ? {
  //             ...album,
  //             isLiked: newIsLiked,
  //             numLikes: newIsLiked ? album.numLikes + 1 : album.numLikes - 1,
  //           }
  //         : album,
  //     ),
  //   );
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photosData = await PhotoService.getFeedPhotos();
        const albumsData = await AlbumService.getFeedAlbums();
        setFeedPhotos(photosData.feed);
        setFeedAlbums(albumsData.feed);
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchData();
  }, []);

  if (!feedPhotos || !feedAlbums) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        Loading feed data...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

        {isPhotoView ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Photo
                  photo={photo}
                  handleClickPhoto={() => setSelectedPhoto(photo)}
                  // handleLikePhoto={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedAlbums.map((album) => (
              <div
                key={album.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Album
                  album={album}
                  handleClickAlbum={() => setSelectedAlbum(album)}
                  // handleLikeAlbum={() => {}}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AlbumModal
        isOpen={selectedAlbum !== null}
        onClose={() => setSelectedAlbum(null)}
        title={selectedAlbum?.title || ""}
        description={selectedAlbum?.description || ""}
        photos={selectedAlbum?.photos || []}
      />

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        photoUrl={selectedPhoto?.photoUrl || ""}
      />
    </div>
  );
}

export default Feed;
