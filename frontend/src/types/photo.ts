export interface Photo {
  id: number;
  photoUrl: string;
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoModalProps {
  title: string;
  description: string;
  photoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}
