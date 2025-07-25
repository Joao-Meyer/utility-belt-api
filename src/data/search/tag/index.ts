import type { TagEntity } from '@entity/tag';
import type { FindOptionsSelect } from 'typeorm';

export const tagFindParams: FindOptionsSelect<TagEntity> = {
  id: true,
  name: true,
  itemsRate: true,
  totalItems: true,

  // movieTagList: true,
  // seriesTagList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
