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

export interface UserStatType {
  id: string;
  count: number;
  label: string;
}

export interface UserWithFollowStatus extends User {
  isFollowing: boolean;
}
