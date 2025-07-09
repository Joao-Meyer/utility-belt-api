import type { EditHistoryEntity } from '@entity/edit-history';
import type { FindOptionsSelect } from 'typeorm';

export const editHistoryFindParams: FindOptionsSelect<EditHistoryEntity> = {
  id: true,
  entityId: true,
  entityType: true,
  newData: true,
  oldData: true,
  userId: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
