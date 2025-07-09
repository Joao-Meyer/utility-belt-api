import { UserEntity } from '@entity/user';
import { DataSource } from '@infra/database';

export const userRepository = DataSource.getRepository(UserEntity);
