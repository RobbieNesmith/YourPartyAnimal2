import { json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/prisma.server";

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
      const updatedSong = prisma.song.update({
        where: { user_id: userId, id: songId },
        data: {rating: {increment: 1}} 
      });

      return json(updatedSong);
    }
    if (action === "down") {
      const updatedSong = prisma.song.update({
        where: { user_id: userId, id: songId },
        data: { rating: { decrement: 1 } }
      });

      return json(updatedSong);
    }
    throw new Response("Invalid vote", { status: 400 });
  } catch {
    throw new Response("Not Found", {status: 404});
  }
}