import { TMDBMovieById, TMDBSearch, TMDBSeason, TMDBSeasonEpisode, Videos } from '@domain/tbmd';
import { api } from './fetch';

interface TMDBApiReturn {
  findMovieById: (id: string) => Promise<TMDBMovieById | null>;
  findSeriesById: (id: string) => Promise<TMDBMovieById | null>;
  findSeason: (seriesId: string, season: number) => Promise<TMDBSeason | null>;
  search: (q: string) => Promise<TMDBSearch | null>;
}

const routes = {
  search: '/search/multi',
  series: {
    details: (id: string) => `/tv/${id}`,
    videos: (id: string) => `/tv/${id}/videos`
  },
  season: {
    details: (seriesId: string, season: number) => `/tv/${seriesId}/season/${season}`
  },
  movie: {
    details: (id: string) => `/movie/${id}`,
    videos: (id: string) => `/movie/${id}/videos`
  }
};

export const TMDBApi = (): TMDBApiReturn => {
  const append = 'alternative_titles,keywords';

  const findMovieById = async (id: string): Promise<TMDBMovieById | null> => {
    try {
      const response = await api.get<TMDBMovieById>({ route: routes.movie.details(id), append });

      if (!response) return null;

      const videos = await api.get<Videos>({ route: routes.movie.videos(id), isVideo: true });

      return { ...response, videos };
    } catch {
      return null;
    }
  };

  const findSeriesById = async (id: string): Promise<TMDBMovieById | null> => {
    try {
      const response = await api.get<TMDBMovieById>({ route: routes.series.details(id), append });

      if (!response) return null;

      const videos = await api.get<Videos>({ route: routes.series.videos(id), isVideo: true });

      return { ...response, videos };
    } catch {
      return null;
    }
  };

  const findSeason = async (seriesId: string, season: number): Promise<TMDBSeason | null> => {
    try {
      const response = await api.get<TMDBSeason | null>({
        route: routes.season.details(seriesId, season)
      });

      if (response === null) return null;

      return {
        ...response,
        episodes:
          response?.episodes?.map((item) => {
            const data = {
              air_date: item.air_date,
              episode_number: item.episode_number,
              episode_type: item.episode_type,
              id: item.id,
              name: item.name,
              overview: item.overview,
              runtime: item.runtime,
              season_number: item.season_number,
              still_path: item.still_path
            } as TMDBSeasonEpisode;

            return data;
          }) ?? []
      };
    } catch {
      return null;
    }
  };

  const search = async (query: string): Promise<TMDBSearch | null> => {
    try {
      const response = await api.get<{ results: TMDBSearch }>({
        route: routes.search,
        queryParams: { query }
      });

      return response.results;
    } catch {
      return null;
    }
  };

  return { findMovieById, findSeriesById, findSeason, search };
};
