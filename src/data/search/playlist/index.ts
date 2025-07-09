import type { PlaylistEntity } from '@entity/playlist';
import type { FindOptionsSelect } from 'typeorm';

export const playlistFindParams: FindOptionsSelect<PlaylistEntity> = {
  id: true,
  name: true,
  visibility: true,
  imageUrl: true,
  order: true,

  ownerId: true,
  parentId: true,
  // owner: true,
  // parent: true,

  // playlistItemList: true,
  // subPlaylistList: true,
  // themeList: true,
  // userPlaylistList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
