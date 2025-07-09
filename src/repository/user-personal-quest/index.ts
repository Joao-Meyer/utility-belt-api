import { UserPersonalQuestEntity } from '@entity/user-personal-quest';
import { DataSource } from '@infra/database';

export const userPersonalQuestRepository = DataSource.getRepository(UserPersonalQuestEntity);
