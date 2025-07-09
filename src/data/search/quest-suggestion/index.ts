import type { QuestSuggestionEntity } from '@entity/quest-suggestion';
import type { FindOptionsSelect } from 'typeorm';

export const questSuggestionFindParams: FindOptionsSelect<QuestSuggestionEntity> = {
  id: true,
  description: true,
  name: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
