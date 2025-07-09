import { AlternativeTitle, BelongsToCollection, Genre, Keyword, Videos } from './default';

export interface TMDBMovieById {
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  status: string;
  title: string;
  videos: Videos;
  alternative_titles: { titles: AlternativeTitle[] };
  keywords: { keywords: Keyword[] };
}
