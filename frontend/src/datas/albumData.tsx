import type { AlbumData } from "../types/album";

export const mockAlbums: AlbumData[] = [
  {
    id: "1",
    user: "Thanh Nhân",
    title: "Sunset Serenity",
    description:
      "A collection of serene sunset landscapes, capturing the beauty of nature's final light.",
    likes: 124,
    isLikedByCurrentUser: true,
    timestamp: "2 hours ago",
    imgURLs: [
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-001.jpg",
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-002.jpg",
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-003.jpg",
    ],
  },

  {
    id: "2",
    user: "Thanh Nhân",
    title: "Sunset Serenity",
    description:
      "A collection of serene sunset landscapes, capturing the beauty of nature's final light.",
    likes: 36,
    isLikedByCurrentUser: true,
    timestamp: "18 hours ago",
    imgURLs: [
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-004.jpg",
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-005.jpg",
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-006.jpg",
    ],
  },
];

export default mockAlbums;
