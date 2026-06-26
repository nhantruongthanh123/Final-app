export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export interface FollowingUser {
  id: number;
  name: string;
  avatar: string;
  numOfPhotos: number;
  numOfAlbums: number;
}

export interface FollowerUser {
  id: number;
  name: string;
  avatar: string;
  numOfPhotos: number;
  numOfAlbums: number;
}
