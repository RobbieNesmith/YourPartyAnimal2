import { LoaderFunctionArgs } from "@remix-run/node";
import { markSongAsPlayed } from "~/services/QueueService";

export function loader() {
  return new Response("Method Not Allowed!", {status: 405});
}

export async function action({ params }: LoaderFunctionArgs) {
  const userIdString = params.userId;
  const songIdString = params.songId;
  const userId = parseInt(userIdString || "-1");
  const songId = parseInt(songIdString || "-1");
  await markSongAsPlayed(userId, songId);
  return "OK"
}