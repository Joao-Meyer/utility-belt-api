import { SeriesEntity } from '@entity/series';
import { formatSeason } from '../format-season';

export const formatSeries = (series: SeriesEntity): unknown => {
  const { seriesTagList, seriesCategoryList, seriesSeasonList, ...rest } = series;

  const categoryList = seriesCategoryList?.map((item) => item.category);
  const tagList = seriesTagList?.map((item) => item.tag);
  const seasonList = seriesSeasonList
    ?.map((item) => formatSeason(item))
    .sort((a, b) => a.seasonNumber - b.seasonNumber);

  return { ...rest, tagList, categoryList, seasonList };
};
