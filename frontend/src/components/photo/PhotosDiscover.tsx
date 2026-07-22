import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import { usePhotoDiscover } from "@/hooks/usePhotoDiscover";
import type { PaginatedResponse } from "@/types/api";
import type { PhotoWithMeta } from "@/types/photo";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PhotoDiscoverResponse = PaginatedResponse<PhotoWithMeta>;

const PhotosDiscover = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithMeta | null>(
    null,
  );
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotoDiscover();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const discoverPhotos = data?.pages.flatMap((page) => page.items) ?? [];

  const handlePhotoLike = (photoId: string, newIsLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<PhotoDiscoverResponse>>(
      ["photos", "discover"],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((photo) =>
              photo.id === photoId
                ? {
                    ...photo,
                    isLiked: newIsLiked,
                    numLikes: newIsLiked
                      ? photo.numLikes + 1
                      : photo.numLikes - 1,
                  }
                : photo,
            ),
          })),
        };
      },
    );
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [data?.pages, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {discoverPhotos.map((photo) => (
        <div
          key={photo.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Photo
            photo={photo}
            handleClickPhoto={() => setSelectedPhoto(photo)}
            handleLikePhoto={handlePhotoLike}
          />
        </div>
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <LoaderCircle className="animate-spin h-15 w-15" />
      )}

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        photoUrl={selectedPhoto?.photoUrl || ""}
      />
    </div>
  );
};

export default PhotosDiscover;
