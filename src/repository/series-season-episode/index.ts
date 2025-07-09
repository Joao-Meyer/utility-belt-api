import { SeriesSeasonEpisodeEntity } from '@entity/series-season-episode';
import { DataSource } from '@infra/database';

export const seriesSeasonEpisodeRepository = DataSource.getRepository(SeriesSeasonEpisodeEntity);
