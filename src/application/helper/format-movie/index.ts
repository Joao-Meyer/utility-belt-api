import { MovieEntity } from '@entity/movie';

export const formatMovie = (movie: MovieEntity): unknown => {
  const { movieTagList, movieCategoryList, userMovieList, ...rest } = movie;

  const categoryList = movieCategoryList
    ?.filter((item) => item?.category)
    ?.map((item) => item.category);
  const tagList = movieTagList?.filter((item) => item?.tag)?.map((item) => item.tag);
  const userMovie = userMovieList.length ? userMovieList?.[0] : null;

  return { ...rest, tagList, categoryList, userMovie };
};
