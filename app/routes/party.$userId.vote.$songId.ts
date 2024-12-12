import { json, LoaderFunctionArgs } from "@remix-run/node";
import { downvoteSong, upvoteSong } from "~/services/QueueService";

export function loader() {
  return new Response("Method Not Allowed!", {status: 405});
}

export async function action({request, params}: LoaderFunctionArgs) {
  const form = await request.formData();
  const action = form.get("action");
  const userIdString = params.userId;
  const songIdString = params.songId;
  const userId = parseInt(userIdString || "-1");
  const songId = parseInt(songIdString || "-1");

  try {
    if (action === "up") {
      const updatedSong = await upvoteSong(userId, songId);

      return json(updatedSong);
    }
    if (action === "down") {
      const updatedSong = await downvoteSong(userId, songId);

      return json(updatedSong);
    }
    throw new Response("Invalid vote", { status: 400 });
  } catch {
    throw new Response("Not Found", {status: 404});
  }
}