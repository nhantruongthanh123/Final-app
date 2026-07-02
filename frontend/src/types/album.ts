export interface AlbumData {
  id: string;
  user: string;
  title: string;
  description: string;
  likes: number;
  isLikedByCurrentUser: boolean;
  timestamp: string;
  imgURLs: string[];
}

export interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imgURLs: string[];
}
