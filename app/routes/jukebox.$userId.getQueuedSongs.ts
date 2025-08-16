import { LoaderFunctionArgs } from "react-router";
import { getQueuedSongs } from "~/services/QueueService";

export async function loader({ params }: LoaderFunctionArgs) {
  const userIdString = params.userId;
  const userId = parseInt(userIdString || "-1");
  return await getQueuedSongs(userId);
}