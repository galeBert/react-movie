import { useEffect, useMemo } from "react";
import useSWR from "swr";
import Banner from "../components/banner";
import SmallMovieCard from "../components/small-movie-card";
import { fetcher, fetcherWatchlist } from "../lib/fetcher";
import { Movie, MovieList } from "../types/movie";

export default function Home() {
  const { data: latestMovies } = useSWR<MovieList>(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1?api_key=1ab628cd967a44587bf30f8e9820031c",
    fetcher,
    { revalidateOnFocus: false }
  );
  const { data: popular } = useSWR<MovieList>(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: watchedList, mutate } = useSWR<MovieList>(
    "https://api.themoviedb.org/3/account/21022737/watchlist/movies",
    fetcherWatchlist
  );
  const revalidate = () => {
    mutate();
  };

  useEffect(() => {
    if (watchedList) {
      localStorage.setItem(
        "watched",
        JSON.stringify(
          watchedList.results.map((mov) => ({ ...mov, watched: true }))
        )
      );
    }
  }, [watchedList]);
  const popularData = useMemo(
    () =>
      popular?.results.map((mov) => {
        return {
          ...mov,
          watched: !!watchedList?.results.find((data) => data.id === mov.id),
        };
      }),
    [popular, watchedList]
  );

  const latestMovieData = useMemo(
    () =>
      latestMovies?.results.map((mov) => {
        return {
          ...mov,
          watched: !!watchedList?.results.find((data) => data.id === mov.id),
        };
      }),
    [latestMovies, watchedList]
  );
  return (
    <main className="flex items-start bg-inherit  from-black to-red-950 pt-20 min-h-screen space-y-3 container relative flex-col p-4">
      <div className="relative h-96 w-full">
        <Banner list={{ results: popularData ?? [] }} />
      </div>
      <label className="font-mono text-2xl">Latest</label>
      <div className="flex overflow-x-scroll w-full scrollbar-hide">
        <div className="flex space-x-4">
          {latestMovieData?.map((movie: Movie, index: number) => (
            <SmallMovieCard key={index} movie={movie} revalidate={revalidate} />
          ))}
        </div>
      </div>
    </main>
  );
}
