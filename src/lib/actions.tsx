import { Movie } from "../types/movie";

async function addToWatchList(
  url: string,
  {
    arg,
  }: {
    arg: { media_type: string; media_id: number | string; watchlist: boolean };
  }
) {
  const { media_id, media_type, watchlist } = arg;
  //   try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWI2MjhjZDk2N2E0NDU4N2JmMzBmOGU5ODIwMDMxYyIsIm5iZiI6MTcyMjcxODA1OS44NjAyNzUsInN1YiI6IjY1ZDYxNjExZWQyYWMyMDE3YzM1MTNmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QhqiWBUD8-mCND8NkfLp8J3esdZAZUqxbzUWxUSs_-0",
    },
    body: JSON.stringify({ media_id, media_type, watchlist }),
  });
  if (response.ok) {
    return response.json() as unknown as { exists: boolean };
  } else {
    return null;
  }
}

export { addToWatchList };
