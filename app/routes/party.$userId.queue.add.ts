import { ActionFunctionArgs, json } from "@remix-run/node";
import { YoutubeSearchApi } from "youtube-search-api-ts";
import { enqueueSong } from "~/services/QueueService";

export async function loader() {
  throw new Response("Method not allowed.", { status: 405 });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = params.userId;
  if (!userId) {
    throw new Response("Not Found", { status: 404 });
  }
  const userIdInt = parseInt(userId);

  if (!userIdInt) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const id = form.get("id") as string | null;
  if (!id) {
    throw new Response("ID is required", { status: 400 });
  }
  const api = new YoutubeSearchApi();
  const videoDetails = await api.getVideoDetails(id);

  await enqueueSong(userIdInt, videoDetails.id, videoDetails.title);

  return json({ details: videoDetails });
}