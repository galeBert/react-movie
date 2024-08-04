import Autoplay from "embla-carousel-autoplay";

import { useState } from "react";
import { MovieList } from "../types/movie";
import Modal from "./modal";
import MovieDetail from "./movie-details";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export default function Banner({ list }: { list?: MovieList }) {
  const [isOpen, setIsOpen] = useState("");
  const onClose = () => {
    setIsOpen("");
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
                <div className="relative h-full w-full ">
                  <img
                    key={Date.now()}
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.original_title}
                    className="w-full h-full absolute"
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
                <div className="w-1/2 flex-col text-white justify-center space-y-3 items-end h-full flex py-4 px-10 right-0 z-[20] from-40% absolute rounded-l-2xl top-0 bg-gradient-to-l from-black">
                  <h1 className="text-5xl text-left">{movie.original_title}</h1>
                  <p className="text-right">{movie.overview}</p>
                  <Button
                    variant="secondary"
                    onClick={() => setIsOpen(movie.id)}
                  >
                    Details
                  </Button>
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
