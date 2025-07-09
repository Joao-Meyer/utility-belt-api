import { UserDayEntity } from '@entity/user-day';
import { DataSource } from '@infra/database';

export const userDayRepository = DataSource.getRepository(UserDayEntity);
