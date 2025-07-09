import type { ImageEntity } from '@entity/image';
import type { FindOptionsSelect } from 'typeorm';

export const imageFindParams: FindOptionsSelect<ImageEntity> = {
  id: true,
  url: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
