export interface PhotoData {
  id: number;
  user: string;
  title: string;
  description: string;
  likes: number;
  isLikedByCurrentUser: boolean;
  timestamp: string;
  imgURL: string;
  isPublic?: boolean;
}

export interface PhotoModalProps {
  title: string;
  description: string;
  imgURL: string;
  isOpen: boolean;
  onClose: () => void;
}
