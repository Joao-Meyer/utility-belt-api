import { QuestEntity } from '@entity/quest';
import { DataSource } from '@infra/database';

export const questRepository = DataSource.getRepository(QuestEntity);
