import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { checkLoggedIn } from "~/services/AuthService.server";
import { clearSongs } from "~/services/QueueService";

export function loader() {
  return new Response("Method Not Allowed!", {status: 405});
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const { userId, destination } = params;

  const idNum = parseInt(userId || "-1");

  await checkLoggedIn(request, idNum);

  const formData = await request.formData();
  const clearPlayed = formData.get("clearPlayed") === "true";
  if (!(destination === "preset" || destination === "queue")) {
    return;
  }

  clearSongs(idNum, destination === "preset", clearPlayed);

  return redirect(`/party/${userId}/manage/${destination}`);
}