import { QuestSuggestionEntity } from '@entity/quest-suggestion';
import { DataSource } from '@infra/database';

export const questSuggestionRepository = DataSource.getRepository(QuestSuggestionEntity);
