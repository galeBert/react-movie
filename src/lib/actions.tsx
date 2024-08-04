async function addToWatchList(
  url: string,
  {
    arg,
  }: {
    arg: { media_type: string; media_id: number | string; watchlist: boolean };
  }
) {
  const { media_id, media_type, watchlist } = arg;
  const token = process.env.REACT_APP_API_TOKEN;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ media_id, media_type, watchlist }),
  });
  if (response.ok) {
    return response.json() as unknown as { exists: boolean };
  } else {
    return null;
  }
}
async function addRating(
  url: string,
  {
    arg,
  }: {
    arg: { value: number };
  }
) {
  const { value } = arg;
  const token = process.env.REACT_APP_API_TOKEN;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });
  if (response.ok) {
    return response.json() as unknown as { exists: boolean };
  } else {
    return null;
  }
}

export { addToWatchList, addRating };
