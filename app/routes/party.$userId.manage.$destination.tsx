import { Button, Stack } from "@mui/material";
import { Song } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import DjSongQueue from "~/components/DjSongQueue";
import { prisma } from "~/prisma.server";
import { getPresetSongs, getQueuedSongs } from "~/services/QueueService";

export async function loader({ params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");
  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }

  const destination = params.destination;

  if (destination != "queue" && destination != "preset") {
    throw typedjson({ title: "Invalid destination", message: "That's not a type of song you can manage." }, { status: 404 });
  }

  let songsToManage = [] as Song[];

  if (destination === "preset") {
    songsToManage = await getPresetSongs(user.id);
  } else {
    songsToManage = await getQueuedSongs(user.id);
  }
  return typedjson({ user, songsToManage });
}

export default function PresetManagementPage() {
  const { user, songsToManage } = useTypedLoaderData<typeof loader>();
  const { destination } = useParams();

  return (
    <Stack sx={{ height: "100%" }}>
      <header className="section main">
        <h1>Welcome to {user.name}&apos;s party</h1>
      </header>
      <Button className="section action" href={`/party/${user.id}/${destination}/add`}>Add a song</Button>
      <div className="section" style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        <h2>Queued Songs</h2>
        <DjSongQueue queuedSongs={songsToManage} />
      </div>
    </Stack>
  );
}