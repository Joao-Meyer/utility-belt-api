import type { UserQuestEntity } from '@entity/user-quest';
import type { FindOptionsSelect } from 'typeorm';
import { imageFindParams } from '../image';

export const userQuestFindParams: FindOptionsSelect<UserQuestEntity> = {
  id: true,
  day: true,
  imageList: imageFindParams,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
