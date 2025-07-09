import { UserQuestEntity } from '@entity/user-quest';
import { DataSource } from '@infra/database';

export const userQuestRepository = DataSource.getRepository(UserQuestEntity);
