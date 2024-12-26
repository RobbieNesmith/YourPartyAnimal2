import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/prisma.server";
import { getNowPlaying, getQueuedSongs } from "~/services/QueueService";

export async function loader({ params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");
  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  const nowPlaying = await getNowPlaying(user.id);
  const queuedSongs = await getQueuedSongs(user.id);
  return json({ user, nowPlaying, queuedSongs });
}

export default function DjPartyView() {
  const {user, nowPlaying, queuedSongs} = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{user.name}'s Party</h1>
    </div>
  )
}