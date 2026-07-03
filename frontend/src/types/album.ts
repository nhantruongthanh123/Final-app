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

export interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imgURLs: string[];
}
