import type { UserEntity } from '@entity/user';
import type { FindOptionsSelect } from 'typeorm';

export const userFindParams: FindOptionsSelect<UserEntity> = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
