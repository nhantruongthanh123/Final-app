import { PhotoService } from "@/services/photo.service";
import type { PhotoFeed } from "@/types/photo";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PhotoFeedResponse {
  feed: PhotoFeed[];
  total: number;
}

const LIMIT = 20;

export function usePhotoFeed() {
  return useInfiniteQuery<PhotoFeedResponse, Error>({
    queryKey: ["photos", "feed"],
    queryFn: async ({ pageParam }) => {
      return PhotoService.getFeedPhotos(pageParam as number, LIMIT);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.feed.length, 0);
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}
