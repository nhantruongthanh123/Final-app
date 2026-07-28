import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import { usePhotoFeed } from "@/hooks/photo/usePhotoFeed";
import { useFollowUser } from "@/hooks/user/useFollowUser";
import type { PaginatedResponse } from "@/types/api";
import type { PhotoWithMeta } from "@/types/photo";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmptyState from "../shared/EmptyState";

type PhotoFeedResponse = PaginatedResponse<PhotoWithMeta>;

const PhotosFeed = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithMeta | null>(
    null,
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const searchQuery = searchParams.get("search") || "";
  const followMutation = useFollowUser();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotoFeed(searchQuery);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const feedPhotos = data?.pages.flatMap((page) => page.items) ?? [];

  const handlePhotoLike = (photoId: string, newIsLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<PhotoFeedResponse>>(
      ["photos", "feed", searchQuery],
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

  const handlePhotoFollow = (userId: string, isCurrentlyFollowing: boolean) => {
    followMutation.mutate({
      userId,
      isCurrentlyFollowing,
    });
    queryClient.setQueryData<InfiniteData<PhotoFeedResponse>>(
      ["photos", "feed", searchQuery],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((photo) =>
              photo.user.id === userId
                ? {
                    ...photo,
                    user: {
                      ...photo.user,
                      isFollowing: !isCurrentlyFollowing,
                    },
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

  if (feedPhotos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title="No photos to show"
        description="There are no photos available in your feed at the moment. Follow more users to see their photos here."
        actionLabel="Move to discover"
        onAction={() => navigate("/discover")}
      />
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {feedPhotos.map((photo) => (
        <div
          key={photo.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Photo
            photo={photo}
            handleClickPhoto={() => setSelectedPhoto(photo)}
            handleLikePhoto={handlePhotoLike}
            handleFollowUser={handlePhotoFollow}
          />
        </div>
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <LoaderCircle className="animate-spin h-15 w-15" />
      )}

      {!isFetchingNextPage && !hasNextPage && (
        <div className="flex justify-center items-center md:col-span-2">
          <EmptyState
            icon={<ImageOff className="w-10 h-10 text-orange-400" />}
            title="You've reached the end of the feed"
            description="There are no photos or you have reached the end of the feed. Follow more users to see their photos here."
            actionLabel="Move to discover"
            onAction={() => navigate("/discover")}
          />
        </div>
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

export default PhotosFeed;
