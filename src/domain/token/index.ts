export interface RequestUser {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
}

export interface UserTokenInput {
  id: number;
  username: string;
}
