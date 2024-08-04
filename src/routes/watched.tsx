import React, { useEffect, useMemo, useState } from "react";
import SmallMovieCard from "../components/small-movie-card";
import { Movie, MovieList } from "../types/movie";
import useSWR, { useSWRConfig } from "swr";
import { fetcher, fetcherWatchlist } from "../lib/fetcher";
import useLocalStorage from "../lib/helpers";

export default function WatchedMovie() {
  const url = "https://api.themoviedb.org/3/account/21022737/watchlist/movies";

  const { data, mutate } = useSWR<MovieList>(url, fetcherWatchlist);

  const watchedData = useMemo(() => {
    return data?.results.map((mov) => ({ ...mov, watched: true }));
  }, [data]);

  useEffect(() => {
    if (watchedData) {
      localStorage.setItem("watched", JSON.stringify(watchedData));
    }
  }, [watchedData]);

  return (
    <main className="flex items-start bg-inherit from-black to-red-950 pt-20 min-h-screen space-y-3 container relative flex-col p-4">
      <h1>Watched Movie</h1>
      <div className="flex space-x-4 overflow-scroll">
        {watchedData?.map((movie: Movie, index: number) => (
          <SmallMovieCard key={index} movie={movie} revalidate={mutate} />
        ))}
      </div>
    </main>
  );
}
