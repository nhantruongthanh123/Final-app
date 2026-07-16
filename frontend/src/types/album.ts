export interface Album {
  id: string;
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  photos: AlbumImage[];
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
  photos: AlbumImage[];
}

export interface AlbumImage {
  id: string;
  photoUrl: string;
}

export interface newPhotoPreview {
  id: string;
  file: File;
  previewUrl: string;
}
