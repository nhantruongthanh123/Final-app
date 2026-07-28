import AlbumModal from "@/components/album/AlbumModal";
import TargetAlbumUser from "@/components/album/TargetAlbumUser";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { useAlbumUser } from "@/hooks/useAlbumUser";
import type { Album } from "@/types/album";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserAlbums = () => {
  // const user = useAuthStore((state) => state.user);
  const { id: publicUserId } = useParams<{ id: string }>();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAlbumUser(
    publicUserId,
    debouncedSearch,
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const albums = data?.pages.flatMap((page) => page.albums) ?? [];

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

  if (albums.length === 0) {
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
          title={"No albums found."}
          description={"Sorry, no albums match your search criteria."}
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <TargetAlbumUser
            key={album.id}
            album={album}
            handleClickAlbum={() => {
              setSelectedAlbum(album);
            }}
          />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <LoaderCircle className="animate-spin h-15 w-15" />
      )}

      <AlbumModal
        isOpen={selectedAlbum !== null}
        onClose={() => setSelectedAlbum(null)}
        title={selectedAlbum?.title || ""}
        description={selectedAlbum?.description || ""}
        photos={selectedAlbum?.photos || []}
      />
    </div>
  );
};

export default TargetUserAlbums;
