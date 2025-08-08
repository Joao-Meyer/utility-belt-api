import type { PlaylistEntity } from '@entity/playlist';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import type { FindOptionsSelect } from 'typeorm';
import { userFindParams } from '../user';

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

export const playlistFindParamsQuery = findParamsToSelect([
  [playlistFindParams, 'p'],
  [userFindParams, 'o']
]);
