import { ImageEntity } from '@entity/image';
import { DataSource } from '@infra/database';

export const imageRepository = DataSource.getRepository(ImageEntity);
