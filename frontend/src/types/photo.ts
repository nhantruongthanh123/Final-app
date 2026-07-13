export interface Photo {
  id: string;
  photoUrl: string;
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoFeed extends Photo {
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  numLikes: number;
  isLiked: boolean;
}

export interface PhotoModalProps {
  title: string;
  description: string;
  photoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}
