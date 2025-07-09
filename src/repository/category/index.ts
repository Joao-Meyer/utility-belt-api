import { CategoryEntity } from '@entity/category';
import { DataSource } from '@infra/database';

export const categoryRepository = DataSource.getRepository(CategoryEntity);
