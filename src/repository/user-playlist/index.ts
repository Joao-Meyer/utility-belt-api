import { UserPlaylistEntity } from '@entity/user-playlist';
import { DataSource } from '@infra/database';

export const userPlaylistRepository = DataSource.getRepository(UserPlaylistEntity);
