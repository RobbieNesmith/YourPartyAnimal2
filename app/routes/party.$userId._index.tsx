import { Button, Stack } from "@mui/material";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GuestSongQueue from "~/components/GuestSongQueue";
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

export default function PartyView() {
  const { user, nowPlaying, queuedSongs } = useLoaderData<typeof loader>();

  const queuedSongsWithCorrectDates = queuedSongs.map(s => ({
    ...s,
    requested_at: new Date(s.requested_at),
    played_at: s.played_at ? new Date(s.played_at) : null})
  );

  return (
    <Stack>
      <h1>Welcome to {user.name}'s party</h1>
      <div>
        <h2>Now Playing</h2>
        <div>{nowPlaying?.name || "Nothing yet" }</div>
      </div>
      <Button href={`/party/${user.id}/queue/add`}>Add a song</Button>
      <div>
        <h2>Queued Songs</h2>
        <GuestSongQueue queuedSongs={queuedSongsWithCorrectDates} />
      </div>
    </Stack>
  );
}