import type { PersonalQuestEntity } from '@entity/personal-quest';
import type { FindOptionsSelect } from 'typeorm';

export const personalQuestFindParams: FindOptionsSelect<PersonalQuestEntity> = {
  id: true,
  description: true,
  name: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
