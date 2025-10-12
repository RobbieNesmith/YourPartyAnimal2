import { LoaderFunctionArgs } from "react-router";
import { checkLoggedIn } from "~/services/AuthService.server";
import { getQueuedSongs } from "~/services/QueueService";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userIdString = params.userId;
  const userId = parseInt(userIdString || "-1");

  await checkLoggedIn(request, userId);

  return await getQueuedSongs(userId, true);
}