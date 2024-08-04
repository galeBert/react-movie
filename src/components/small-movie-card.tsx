import { CheckIcon, EyeIcon, Popcorn } from "lucide-react";
import React, { useState } from "react";

import Modal from "./modal";
import MovieDetailModal from "./movie-details";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltipp";
import useSWRMutation from "swr/mutation";
import { addToWatchList } from "../lib/actions";
import { Movie } from "../types/movie";

export default function SmallMovieCard({
  movie,
  revalidate,
}: {
  movie: Movie;
  revalidate?: () => void;
}) {
  const url = "https://api.themoviedb.org/3/account/21022737/watchlist";
  const { data, trigger } = useSWRMutation(url, addToWatchList);
  const [isOpen, setIsOpen] = useState("");
  const watchedListJSON = localStorage.getItem("watched");
  const watchedList: Movie[] = watchedListJSON
    ? JSON.parse(watchedListJSON)
    : [];

  const onClose = () => {
    setIsOpen("");
  };
  const handleOpen = () => {
    setIsOpen(movie.id);
  };
  const handleMarkWatch = async () => {
    try {
      await trigger({
        media_id: movie.id,
        media_type: "movie",
        watchlist: !movie.watched,
      });
      revalidate?.();
    } catch (error) {
      console.log(error, "dsfnfd");
      const err = error as unknown as Error;
      if ((err.message = "Failed to fetch")) {
        const watchListJSON = localStorage.getItem("watched");
        const watchedListTranslated: Movie[] = watchListJSON
          ? JSON.parse(watchListJSON)
          : [];
        const offlineActionRemoved = localStorage.getItem(
          "offline-action-remove-watched"
        );
        const offlineActionRemovedTranslated: string[] = offlineActionRemoved
          ? JSON.parse(offlineActionRemoved)
          : [];
        if (movie.watched) {
          localStorage.setItem(
            "watched",
            JSON.stringify(
              watchedListTranslated.filter((mov) => mov.id !== movie.id)
            )
          );
          localStorage.setItem(
            "offline-action-remove-watched",
            JSON.stringify([...offlineActionRemovedTranslated, movie.id])
          );
        } else {
          localStorage.setItem(
            "watched",
            JSON.stringify([...watchedListTranslated, movie])
          );
          localStorage.setItem(
            "offline-action-remove-watched",
            JSON.stringify(
              offlineActionRemovedTranslated.filter((id) => id !== movie.id)
            )
          );
        }
        revalidate?.();
      }
    }

    // revalidate?.();
    // const watchedListJSONData = localStorage.getItem("watched");
    // const watchedListData: Movie[] = watchedListJSONData
    //   ? JSON.parse(watchedListJSONData)
    //   : [];
    // if (isWatched) {
    //   localStorage.setItem(
    //     "watched",
    //     JSON.stringify(watchedListData.filter((data) => data.id !== movie.id))
    //   );
    // } else {
    //   localStorage.setItem(
    //     "watched",
    //     JSON.stringify([...watchedListData, { ...movie }])
    //   );
    // }
  };

  return (
    <>
      <Card className="w-44 flex flex-col justify-between items-stretch h-full">
        <CardContent className="px-2 py-2 w-full">
          <div className="relative h-[200px] w-full">
            <img
              key={navigator.onLine ? Date.now() : undefined}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="Poster"
              className="w-full h-full bg-cover absolute"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-between h-full w-full space-y-3">
          {movie.original_title}
          <div className="flex items-center text-sm space-x-2 justify-end">
            <Button size="sm" onClick={handleOpen}>
              Details
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-green-500 rounded-full !p-0"
                    variant="outline"
                    onClick={handleMarkWatch}
                  >
                    {movie.watched ? (
                      <CheckIcon className="stroke-white h-4 w-4" />
                    ) : (
                      <Popcorn />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {movie.watched ? (
                    <p>Remove To Watched</p>
                  ) : (
                    <p>Add To Watched</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
      <Modal isOpen={!!isOpen} onClose={onClose}>
        <MovieDetailModal id={isOpen} />
      </Modal>
    </>
  );
}
