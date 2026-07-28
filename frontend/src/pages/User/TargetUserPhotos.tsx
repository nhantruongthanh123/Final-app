import PhotoModal from "@/components/photo/PhotoModal";
import TargetPhotoUser from "@/components/photo/TargetPhotoUser";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { usePhotoUser } from "@/hooks/photo/usePhotoUser";
import type { Photo } from "@/types/photo";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserPhotos = () => {
  const { id: publicUserId } = useParams<{ id: string }>();
  // const user = useAuthStore((state) => state.user);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePhotoUser(
    publicUserId,
    debouncedSearch,
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const photos = data?.pages.flatMap((page) => page.photos) ?? [];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col p-4 w-full">
        {/* FILTER BAR */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by title"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>

        <EmptyState
          icon={<ImageOff className="w-10 h-10 text-orange-400" />}
          title={"No photos found."}
          description={"Sorry, no photos match your search criteria."}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full">
      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {photos.map((photo) => (
          <TargetPhotoUser
            key={photo.id}
            photo={photo}
            handleClickPhoto={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

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

export default TargetUserPhotos;
