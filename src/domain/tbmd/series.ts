import { AlternativeTitle, Genre, Keyword, VideoResult } from './default';

export interface SeriesById {
  backdrop_path: string;
  genres: Genre[];
  homepage: string;
  id: number;
  first_air_date: string;
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  overview: string;
  poster_path: string;
  seasons: Season[];
  status: string;
  type: string;
  videos: VideoResult;
  alternative_titles: { results: AlternativeTitle[] };
  episode_groups: { results: EpisodeGroup[] };
  keywords: { results: Keyword[] };
}

// export interface Genre {
//   id: number;
//   name: string;
// }

// export interface Episode {
//   id: number;
//   name: string;
//   overview: string;
//   vote_average: number;
//   vote_count: number;
//   air_date: string;
//   episode_number: number;
//   episode_type: string;
//   production_code: string;
//   runtime: number;
//   season_number: number;
//   show_id: number;
//   still_path: string | null;
// }

// export interface Network {
//   id: number;
//   logo_path: string | null;
//   name: string;
//   origin_country: string;
// }

// export interface ProductionCompany {
//   id: number;
//   logo_path: string | null;
//   name: string;
//   origin_country: string;
// }

// export interface ProductionCountry {
//   iso_3166_1: string;
//   name: string;
// }

// export interface SpokenLanguage {
//   english_name: string;
//   iso_639_1: string;
//   name: string;
// }

export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

// export interface AlternativeTitle {
//   iso_3166_1: string;
//   title: string;
//   type: string;
// }

export interface EpisodeGroup {
  description: string;
  episode_count: number;
  group_count: number;
  id: string;
  name: string;
  network: string | null;
  type: number;
}

// export interface Video {
//   iso_639_1: string;
//   iso_3166_1: string;
//   name: string;
//   key: string;
//   site: string;
//   size: number;
//   type: string;
//   official: boolean;
//   published_at: string;
//   id: string;
// }

// export interface Keyword {
//   id: number;
//   name: string;
// }
