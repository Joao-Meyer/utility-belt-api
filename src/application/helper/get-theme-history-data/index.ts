import { HistoryEntityType } from '@domain/enum';
import { ThemeEntity } from '@entity/theme';

export const getThemeHistoryData = (
  theme: Partial<ThemeEntity>
): {
  entity: HistoryEntityType;
  id: number;
} => {
  if (typeof theme.movieId === 'number')
    return {
      entity: HistoryEntityType.MOVIE,
      id: theme.movieId
    };

  if (typeof theme.seriesId === 'number')
    return {
      entity: HistoryEntityType.SERIES,
      id: theme.seriesId
    };

  if (typeof theme.seriesSeasonId === 'number')
    return {
      entity: HistoryEntityType.SERIES_SEASON,
      id: theme.seriesSeasonId
    };

  return {
    entity: HistoryEntityType.MOVIE,
    id: 0
  };
};
