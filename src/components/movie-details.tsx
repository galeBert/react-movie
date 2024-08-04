import React, { useEffect, useRef, useState } from "react";
import { DialogContent } from "@radix-ui/react-dialog";

import YouTube from "react-youtube";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { VideoOff } from "lucide-react";

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
  const {
    data: details,
    error,
    isLoading,
  } = useSWR<MovieDetails>(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    fetcher
  );

  const ref = useRef(null);

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
      </DialogContent>
    </div>
  );
}
