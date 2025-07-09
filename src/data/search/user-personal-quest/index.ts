import type { UserPersonalQuestEntity } from '@entity/user-personal-quest';
import type { FindOptionsSelect } from 'typeorm';
import { imageFindParams } from '../image';

export const userPersonalQuestFindParams: FindOptionsSelect<UserPersonalQuestEntity> = {
  id: true,
  day: true,
  imageList: imageFindParams,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
