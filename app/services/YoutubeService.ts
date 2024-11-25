import { SearchOutput } from "youtube-search-api-ts";

export async function searchYoutube(query: string) {
  const searchResponse = await fetch("/search?" + new URLSearchParams({q: query}));
  return (await searchResponse.json()) as SearchOutput;
}