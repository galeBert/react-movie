import { CheckIcon, Popcorn } from "lucide-react";
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
import { cn } from "../lib/utils";

export default function SmallMovieCard({
  movie,
  revalidate,
}: {
  movie: Movie;
  revalidate?: () => void;
}) {
  const url = "https://api.themoviedb.org/3/account/21022737/watchlist";
  const { trigger } = useSWRMutation(url, addToWatchList);
  const [isOpen, setIsOpen] = useState("");

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
      const err = error as unknown as Error;
      if ((err.message = "Failed to fetch")) {
        const watchListJSON = localStorage.getItem("watched");
        const watchedListTranslated: Movie[] = watchListJSON
          ? JSON.parse(watchListJSON)
          : [];
        const offlineActionRemoved = localStorage.getItem(
          "offline-action-remove-watched"
        );
        const offlineActionRemovedTranslated: {
          id: string;
          watched: boolean;
        }[] = offlineActionRemoved ? JSON.parse(offlineActionRemoved) : [];

        const index = offlineActionRemovedTranslated.findIndex(
          (prev) => prev.id === movie.id
        );
        if (index >= 0) {
          localStorage.setItem(
            "offline-action-remove-watched",
            JSON.stringify(
              offlineActionRemovedTranslated.map((prev) => {
                if (prev.id === movie.id) {
                  prev.watched = !prev.watched;
                }
                return prev;
              })
            )
          );
        } else {
          localStorage.setItem(
            "offline-action-remove-watched",
            JSON.stringify([
              ...offlineActionRemovedTranslated,
              { id: movie.id, watched: !movie.watched },
            ])
          );
        }

        if (movie.watched) {
          localStorage.setItem(
            "watched",
            JSON.stringify(
              watchedListTranslated.filter((mov) => mov.id !== movie.id)
            )
          );
        } else {
          localStorage.setItem(
            "watched",
            JSON.stringify([...watchedListTranslated, movie])
          );
        }
        revalidate?.();
      }
    }
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
          <div className="flex items-center text-sm space-x-2 w-full justify-end">
            <Button className=" h-8" size="sm" onClick={handleOpen}>
              Details
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(" w-8 group h-8 !p-0", {
                      "bg-green-500": movie.watched,
                    })}
                    variant="outline"
                    onClick={handleMarkWatch}
                  >
                    {movie.watched ? (
                      <CheckIcon className="stroke-white group-active:stroke-black h-4 w-4" />
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
