import { QuestSuggestionVoteEntity } from '@entity/quest-suggestion-vote';
import { DataSource } from '@infra/database';

export const questSuggestionVoteRepository = DataSource.getRepository(QuestSuggestionVoteEntity);
