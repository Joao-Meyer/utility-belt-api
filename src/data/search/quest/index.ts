import type { QuestEntity } from '@entity/quest';
import type { FindOptionsSelect } from 'typeorm';

export const questFindParams: FindOptionsSelect<QuestEntity> = {
  id: true,
  description: true,
  name: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
