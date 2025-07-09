import { TagEntity } from '@entity/tag';
import { DataSource } from '@infra/database';

export const tagRepository = DataSource.getRepository(TagEntity);
