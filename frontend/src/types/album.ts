export interface Album {
  id: string;
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AlbumFeed extends Album {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  numLikes: number;
  isLiked: boolean;
}

export interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  photos: string[];
}
