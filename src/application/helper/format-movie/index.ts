import { MovieEntity } from '@entity/movie';

export const formatMovie = (movie: MovieEntity): unknown => {
  const { movieTagList, movieCategoryList, ...rest } = movie;

  const categoryList = movieCategoryList?.map((item) => item.category);
  const tagList = movieTagList?.map((item) => item.tag);

  return { ...rest, tagList, categoryList };
};
