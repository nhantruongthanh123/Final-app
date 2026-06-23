import type { PhotoData } from "./types/photo";

const mockPhotos: PhotoData[] = [
  {
    user: "Thanh Nhân",
    title: "Golden Hour at the Lake",
    description:
      "A calm evening shot with warm sunlight reflecting across the water and soft clouds in the background.",
    likes: 124,
    isLikedByCurrentUser: true,
    timestamp: "2 hours ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-001.jpg",
  },
  {
    user: "Junior Developer",
    title: "City Lights After Rain",
    description:
      "Neon reflections on the street after a light rain, capturing the energy of the city at night.",
    likes: 89,
    isLikedByCurrentUser: false,
    timestamp: "5 hours ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-002.jpg",
  },
  {
    user: "A B C",
    title: "Mountain Trail Morning",
    description:
      "A wide landscape view of a hiking trail surrounded by fog, pine trees, and early morning light.",
    likes: 156,
    isLikedByCurrentUser: false,
    timestamp: "1 day ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-003.jpg",
  },
  {
    user: "Thanh Nhân",
    title: "Weekend Coffee Stop",
    description:
      "A cozy cafe corner with a book, coffee cup, and natural window light for a relaxed weekend mood.",
    likes: 47,
    isLikedByCurrentUser: true,
    timestamp: "2 days ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-004.jpg",
  },
  {
    user: "Thanh Nhân",
    title: "Ocean Breeze Walk",
    description:
      "A peaceful beach path with waves rolling in and a bright sky stretching across the horizon.",
    likes: 203,
    isLikedByCurrentUser: false,
    timestamp: "3 days ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-005.jpg",
  },
  {
    user: "Thanh Nhân",
    title: "Bloom Season",
    description:
      "Soft pink flowers in full bloom, creating a gentle and colorful spring portrait.",
    likes: 71,
    isLikedByCurrentUser: true,
    timestamp: "1 week ago",
    imgURL:
      "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-006.jpg",
  },
];

export default mockPhotos;
