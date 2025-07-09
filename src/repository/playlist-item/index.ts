import { PlaylistItemEntity } from '@entity/playlist-item';
import { DataSource } from '@infra/database';

export const playlistItemRepository = DataSource.getRepository(PlaylistItemEntity);
