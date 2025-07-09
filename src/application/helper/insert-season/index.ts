import { SeasonStatus } from '@domain/enum';
import { SeriesSeasonEntity } from '@entity/series-season';
import { SeriesSeasonEpisodeEntity } from '@entity/series-season-episode';
import { ThemeEntity } from '@entity/theme';
import { insertId } from '@main/utils';
import { EntityManager } from 'typeorm';

interface EpisodeBody {
  title: string;
  synopsis?: string;
  imageUrl: string;
  episodeNumber: number;
  tmdbId: number;
  seasonNumber: number;
  duration: number;
  airedAt?: Date | null;
}

interface SeasonBody {
  name: string;
  synopsis?: string;
  imageUrl: string;
  totalEpisodes: number;
  status: SeasonStatus;
  seasonNumber: number;
  tmdbId: number;
  airedAt?: Date | null;
  airedEndAt?: Date | null;
  themeList?: Partial<ThemeEntity>[];
  episodeList?: EpisodeBody[];
}

interface insertSeasonProps {
  manager: EntityManager;
  seasonList: SeasonBody[];
  seriesId: number;
}

export const insertSeason = async ({
  manager,
  seasonList,
  seriesId
}: insertSeasonProps): Promise<void> => {
  for await (const season of seasonList) {
    const {
      imageUrl,
      name,
      seasonNumber,
      status,
      totalEpisodes,
      airedAt,
      tmdbId,
      airedEndAt,
      episodeList,
      synopsis,
      themeList
    } = season;

    const seasonId = insertId(
      await manager.insert(SeriesSeasonEntity, {
        imageUrl,
        name,
        seasonNumber,
        status,
        totalEpisodes,
        tmdbId,
        airedAt,
        airedEndAt,
        synopsis,
        series: { id: seriesId }
      })
    );

    if (themeList?.length)
      await manager.insert(
        ThemeEntity,
        themeList.map(({ title, type, url, youtubeId, spotifyUrl, youtubeMusicUrl, order }) => ({
          title,
          type,
          url,
          spotifyUrl,
          youtubeId,
          youtubeMusicUrl,
          order,
          seriesSeason: { id: seasonId }
        }))
      );

    if (episodeList?.length) await insertEpisodeSeason({ episodeList, manager, seasonId });
  }
};

interface insertSeasonEpisodeProps {
  manager: EntityManager;
  episodeList: EpisodeBody[];
  seasonId: number;
}

export const insertEpisodeSeason = async ({
  manager,
  episodeList,
  seasonId
}: insertSeasonEpisodeProps): Promise<void> => {
  await manager.insert(
    SeriesSeasonEpisodeEntity,
    episodeList?.map(
      ({ duration, episodeNumber, tmdbId, imageUrl, seasonNumber, title, airedAt, synopsis }) => ({
        duration,
        episodeNumber,
        imageUrl,
        tmdbId,
        seasonNumber,
        title,
        airedAt,
        synopsis,
        seriesSeason: { id: seasonId }
      })
    )
  );
};
