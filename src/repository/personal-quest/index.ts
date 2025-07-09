import { PersonalQuestEntity } from '@entity/personal-quest';
import { DataSource } from '@infra/database';

export const personalQuestRepository = DataSource.getRepository(PersonalQuestEntity);
