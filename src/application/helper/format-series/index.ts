import { SeriesEntity } from '@entity/series';
import { formatSeason } from '../format-season';

export const formatSeries = (series: SeriesEntity): unknown => {
  const { seriesTagList, seriesCategoryList, seriesSeasonList, userSeriesList, ...rest } = series;

  const tagList = seriesTagList?.filter((item) => item?.tag)?.map((item) => item.tag);

  const categoryList = seriesCategoryList
    ?.filter((item) => item?.category)
    ?.map((item) => item.category);

  const seasonList = seriesSeasonList
    ?.map((item) => formatSeason(item))
    .sort((a, b) => a.seasonNumber - b.seasonNumber);

  const userSeries = userSeriesList.length ? userSeriesList?.[0] : null;

  return { ...rest, tagList, categoryList, seasonList, userSeries };
};
