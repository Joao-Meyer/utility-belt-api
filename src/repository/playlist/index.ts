import { PlaylistEntity } from '@entity/playlist';
import { DataSource } from '@infra/database';

export const playlistRepository = DataSource.getRepository(PlaylistEntity);
