import React, { useEffect, useMemo, useRef, useState } from "react";
import { DialogContent } from "@radix-ui/react-dialog";

import YouTube from "react-youtube";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { VideoOff } from "lucide-react";
import { Button } from "./ui/button";
import useSWRMutation from "swr/mutation";
import { addRating } from "../lib/actions";

type MovieDetails = {
  title: string;
  status: string;
  release_date: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: string;
  vote_count: string;
  runtime: string;
  overview: string;
  videoId?: string;
  genres: {
    id: number;
    name: string;
  }[];
};
export default function MovieDetailModal({ id }: { id: string }) {
  const { data: details, isLoading } = useSWR<MovieDetails>(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    fetcher
  );

  const { data: personalRank, mutate } = useSWR(
    `https://api.themoviedb.org/3/account/21022737/rated/movies?language=en-US&page=1&sort_by=created_at.desc`,
    fetcher
  );
  const personalRankValue = useMemo(
    () =>
      personalRank?.results?.find((list: any) => list.id === id)?.rating ?? 0,
    [personalRank]
  );
  const url = `https://api.themoviedb.org/3/movie/${id}/rating`;

  const { trigger } = useSWRMutation(url, addRating);

  const [rating, setRating] = useState(0);
  const ref = useRef(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (value <= 10) {
      setRating(value);
    }
  };
  const handleSubmit = async () => {
    try {
      await trigger({ value: rating });
      setTimeout(() => {
        mutate();
      }, 100);
      mutate();
    } catch (error) {
      console.log(error, "rating");
    }
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-full flex flex-col space-y-6">
      <DialogHeader>
        <DialogTitle>{details?.title}</DialogTitle>
      </DialogHeader>
      <DialogContent className="flex flex-col space-y-4">
        <div className="relative w-full">
          {details?.videoId ? (
            <YouTube
              ref={ref}
              onReady={(e) => e.target.playVideo()}
              opts={{}}
              videoId={details.videoId}
              iframeClassName="aspect-video z-20 w-full"
            />
          ) : (
            <div className="aspect-video w-full flex-col rounded-xl flex justify-center items-center h-full bg-slate-400">
              <VideoOff />
              <h1>video not availalbe</h1>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-1">
            <Label>Rating:</Label>
            <Label>
              {details?.vote_average}/10 ({details?.vote_count} votes)
            </Label>
          </div>
          <div className="flex space-x-1">
            <Label>Status:</Label>
            <Label>{details?.status}</Label>
          </div>
        </div>
        <DialogDescription>{details?.overview}</DialogDescription>
        <DialogFooter className="flex flex-row items-center justify-between w-full ">
          <div className="w-full flex flex-col">
            <Label>Personal Rate:</Label>
            <Label className="text-2xl">{personalRankValue}</Label>
          </div>
          <div className="flex items-center w-full space-x-1">
            <Label>Add Your Rating:</Label>
            <input
              type="number"
              className="border rounded-sm px-1 border-black"
              value={rating}
              onChange={handleInputChange}
              min={1}
              max={10}
            />
            {/* <RatingStar rating={5} /> */}
            <Button onClick={handleSubmit} disabled={rating < 1}>
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
