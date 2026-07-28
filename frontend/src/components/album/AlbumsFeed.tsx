import { useAlbumFeed } from "@/hooks/album/useAlbumFeed";
import type { AlbumWithMeta } from "@/types/album";
import type { PaginatedResponse } from "@/types/api";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmptyState from "../shared/EmptyState";
import Album from "./Album";
import AlbumModal from "./AlbumModal";

type AlbumFeedResponse = PaginatedResponse<AlbumWithMeta>;

const AlbumsFeed = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithMeta | null>(
    null,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumFeed(searchQuery);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const feedAlbums = data?.pages.flatMap((page) => page.items) ?? [];

  const handleAlbumLike = (albumId: string, newIsLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<AlbumFeedResponse>>(
      ["albums", "feed", searchQuery],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((album) =>
              album.id === albumId
                ? {
                    ...album,
                    isLiked: newIsLiked,
                    numLikes: newIsLiked
                      ? album.numLikes + 1
                      : album.numLikes - 1,
                  }
                : album,
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

  if (feedAlbums.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title="No albums to show"
        description="There are no albums available in your feed at the moment. Follow more users to see their albums here."
        actionLabel="Move to discover"
        onAction={() => navigate("/discover")}
      />
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {feedAlbums.map((album) => (
        <div
          key={album.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Album
            album={album}
            handleClickAlbum={() => setSelectedAlbum(album)}
            handleLikeAlbum={handleAlbumLike}
          />
        </div>
      ))}

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

export default AlbumsFeed;
