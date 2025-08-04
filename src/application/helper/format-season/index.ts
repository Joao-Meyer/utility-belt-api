/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeriesSeasonEntity } from '@entity/series-season';
import { SeriesSeasonEpisodeEntity } from '@entity/series-season-episode';

export const formatSeason = (season: SeriesSeasonEntity): any => {
  const { seriesSeasonEpisodeList, userSeriesSeasonProgressList, ...rest } = season;

  return {
    ...rest,
    userSeriesSeasonProgress: userSeriesSeasonProgressList?.[0] ?? null,
    episodeList: formatSeasonEpisodes(seriesSeasonEpisodeList)
  };
};

export const formatSeasonEpisodes = (episodes: SeriesSeasonEpisodeEntity[]): any => {
  return episodes
    ?.sort((a, b) => a.episodeNumber - b.episodeNumber)
    ?.map((item) => {
      const { userSeriesEpisodeWatchedList, ...rest } = item;

      return { userSeriesEpisodeWatched: userSeriesEpisodeWatchedList?.[0] ?? null, ...rest };
    });
};
