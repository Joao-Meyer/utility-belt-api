import { EditHistoryEntity } from '@entity/edit-history';
import { DataSource } from '@infra/database';

export const editHistoryRepository = DataSource.getRepository(EditHistoryEntity);
