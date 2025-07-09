export interface TMDBSearch {
  id: number;
  backdrop_path: string;
  original_title: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  media_type: 'tv' | 'movie';
}
