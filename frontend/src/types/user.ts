export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FollowingUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  numOfPhotos: number;
  numOfAlbums: number;
}

export interface FollowerUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  numOfPhotos: number;
  numOfAlbums: number;
}
