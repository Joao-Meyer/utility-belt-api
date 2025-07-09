export interface TMDBSeasonEpisode {
  id: number;
  air_date: string;
  episode_number: number;
  episode_type: 'standard' | 'finale';
  name: string;
  overview: string;
  runtime: number;
  season_number: number;
  still_path: string;
}

export interface TMDBSeason {
  air_date: string;
  episodes: TMDBSeasonEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
}
