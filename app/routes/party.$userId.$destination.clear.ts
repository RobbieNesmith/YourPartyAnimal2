import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { clearSongs } from "~/services/QueueService";

export function loader() {
  return new Response("Method Not Allowed!", {status: 405});
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const { userId, destination } = params;
  const formData = await request.formData();
  const clearPlayed = formData.get("clearPlayed") === "true";
  const userIdInt = parseInt(userId || "-1");
  if (!(destination === "preset" || destination === "queue")) {
    return;
  }

  clearSongs(userIdInt, destination === "preset", clearPlayed);

  return redirect(`/party/${userId}/manage/${destination}`);
}