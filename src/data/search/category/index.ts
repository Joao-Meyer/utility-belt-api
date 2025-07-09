import type { CategoryEntity } from '@entity/category';
import type { FindOptionsSelect } from 'typeorm';

export const categoryFindParams: FindOptionsSelect<CategoryEntity> = {
  id: true,
  name: true,

  // movieTagList: true,
  // seriesTagList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
