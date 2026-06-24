export interface PhotoData {
    user: string;
    title: string;
    description: string;
    likes: number;
    isLikedByCurrentUser: boolean;
    timestamp: string;
    imgURL: string;
};

export interface PhotoModalProps {
    title: string;
    description: string;
    imgURL: string;
    isOpen: boolean;
    onClose: () => void;
}