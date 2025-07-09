import type { UserPlaylistEntity } from '@entity/user-playlist';
import type { FindOptionsSelect } from 'typeorm';

export const userPlaylistFindParams: FindOptionsSelect<UserPlaylistEntity> = {
  id: true,
  isCollaborator: true,
  isOwner: true,

  userId: true,
  playlistId: true,
  // user: true,
  // playlist: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
