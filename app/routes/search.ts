import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { YoutubeSearchApi } from "youtube-search-api-ts";

export async function loader({request} : LoaderFunctionArgs) {
  const {searchParams} = new URL(request.url);
  const searchString = searchParams.get("q");
  if (!searchString) {
    throw new Response("Search query (q=) required", {status: 400});
  }
  const api = new YoutubeSearchApi();
  const results = await api.search(searchString, false, 10, [{type: "video"}]);
  return json(results);
}