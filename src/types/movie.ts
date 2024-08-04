type MovieList = {
  results: Movie[];
};
type Movie = {
  poster_path: string;
  backdrop_path: string;
  original_title: string;
  overview: string;
  id: string;
  watched: boolean;
};
type GetMovieResponse = MovieList;

export type { GetMovieResponse, Movie, MovieList };
