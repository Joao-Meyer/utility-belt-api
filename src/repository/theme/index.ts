import { ThemeEntity } from '@entity/theme';
import { DataSource } from '@infra/database';

export const themeRepository = DataSource.getRepository(ThemeEntity);
