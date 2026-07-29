import { useAlbumDiscover } from "@/hooks/album/useAlbumDiscover";
import { useFollowUser } from "@/hooks/user/useFollowUser";
import type { AlbumWithMeta } from "@/types/album";
import type { PaginatedResponse } from "@/types/api";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Album from "./Album";
import AlbumModal from "./AlbumModal";

type AlbumDiscoverResponse = PaginatedResponse<AlbumWithMeta>;

const AlbumsDiscover = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithMeta | null>(
    null,
  );
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const followMutation = useFollowUser();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumDiscover(searchQuery);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const discoverAlbums = data?.pages.flatMap((page) => page.items) ?? [];

  const handleAlbumLike = (albumId: string, newIsLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<AlbumDiscoverResponse>>(
      ["albums", "discover", searchQuery],
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

  const handleAlbumFollow = (userId: string, isCurrentlyFollowing: boolean) => {
    followMutation.mutate({
      userId,
      isCurrentlyFollowing,
    });
    queryClient.setQueryData<InfiniteData<AlbumDiscoverResponse>>(
      ["albums", "discover", searchQuery],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((album) =>
              album.user.id === userId
                ? {
                    ...album,
                    user: {
                      ...album.user,
                      isFollowing: !isCurrentlyFollowing,
                    },
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

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {discoverAlbums.map((album) => (
        <div
          key={album.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Album
            album={album}
            handleClickAlbum={() => setSelectedAlbum(album)}
            handleLikeAlbum={handleAlbumLike}
            handleFollowUser={handleAlbumFollow}
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

export default AlbumsDiscover;
