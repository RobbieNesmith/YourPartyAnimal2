import { Button, Stack } from "@mui/material";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
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
  return typedjson({ user, nowPlaying, queuedSongs });
}

export default function PartyView() {
  const { user, nowPlaying, queuedSongs } = useTypedLoaderData<typeof loader>();

  return (
    <Stack sx={{height: "100%"}}>
      <h1>Welcome to {user.name}'s party</h1>
      <div>
        <h2>Now Playing</h2>
        <div>{nowPlaying?.name || "Nothing yet" }</div>
      </div>
      <Button href={`/party/${user.id}/queue/add`}>Add a song</Button>
        <h2>Queued Songs</h2>
        <GuestSongQueue queuedSongs={queuedSongs} />
    </Stack>
  );
}