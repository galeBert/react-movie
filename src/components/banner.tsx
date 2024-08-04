import Autoplay from "embla-carousel-autoplay";
import { CheckIcon, Popcorn } from "lucide-react";

import { useState } from "react";
import { cn } from "../lib/utils";
import { Movie, MovieList } from "../types/movie";
import Modal from "./modal";
import MovieDetail from "./movie-details";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltipp";
import useSWRMutation from "swr/mutation";
import { addToWatchList } from "../lib/actions";
import { useSWRConfig } from "swr";

export default function Banner({ list }: { list?: MovieList }) {
  const url = "https://api.themoviedb.org/3/account/21022737/watchlist";
  const { mutate } = useSWRConfig();
  const { trigger } = useSWRMutation(url, addToWatchList);

  const [isOpen, setIsOpen] = useState("");
  const onClose = () => {
    setIsOpen("");
  };

  const handleMarkWatch = async (movie: Movie) => {
    try {
      await trigger({
        media_id: movie.id,
        media_type: "movie",
        watchlist: !movie.watched,
      });
      mutate("https://api.themoviedb.org/3/account/21022737/watchlist/movies");
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
        mutate(
          "https://api.themoviedb.org/3/account/21022737/watchlist/movies"
        );
      }
    }
  };

  if (!list?.results) return null;
  return (
    <>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full h-20"
      >
        <CarouselContent>
          {list.results?.map((movie, index) => (
            <>
              <CarouselItem
                className="h-96 w-full rounded-2xl overflow-hidden relative"
                key={index}
              >
                <div className="relative flex h-full w-full ">
                  <img
                    key={Date.now()}
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.original_title}
                    className="w-full h-full absolute rounded-2xl"
                  />
                </div>
                <div className="w-full h-full pointer-events-none rounded-l-2xl backdrop-blur-xl z-[1] absolute top-0">
                  <div className="w-3/4 h-full">
                    <img
                      key={Date.now()}
                      alt={movie.original_title}
                      className="absolute bg-cover rounded-l-2xl h-full w-3/4"
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 w-3/4 flex-col text-white justify-center space-y-3 items-end h-full flex py-4 px-10 right-0 z-[20] from-40% absolute rounded-l-2xl top-0 bg-gradient-to-l from-black">
                  <h1 className="lg:text-5xl text-2xl text-right">
                    {movie.original_title}
                  </h1>
                  <p className="lg:text-base line-clamp-4 md:line-clamp-6 md:text-sm text-xs text-right">
                    {movie.overview}
                  </p>
                  <div className="flex space-x-2 items-center">
                    <Button
                      variant="secondary"
                      onClick={() => setIsOpen(movie.id)}
                    >
                      Details
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className={cn(" w-8 bg-white/20 group h-8 !p-0", {
                              "bg-green-500": movie.watched,
                            })}
                            variant="outline"
                            onClick={() => handleMarkWatch(movie)}
                          >
                            {movie.watched ? (
                              <CheckIcon className="stroke-white group-active:stroke-black h-4 w-4" />
                            ) : (
                              <Popcorn className="" />
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
                </div>
              </CarouselItem>
            </>
          ))}
        </CarouselContent>
      </Carousel>
      <Modal isOpen={!!isOpen} onClose={onClose}>
        <MovieDetail id={isOpen} />
      </Modal>
    </>
  );
}
