import { Button, Stack } from "@mui/material";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import DjSongQueue from "~/components/DjSongQueue";
import { prisma } from "~/prisma.server";
import { getPresetSongs } from "~/services/QueueService";

export async function loader({ params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");
  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  const presetSongs = await getPresetSongs(user.id);
  return typedjson({ user, presetSongs });
}

export default function PresetManagementPage() {
  const { user, presetSongs } = useTypedLoaderData<typeof loader>();

  return (
    <Stack sx={{ height: "100%" }}>
      <header className="section main">
        <h1>Welcome to {user.name}&apos;s party</h1>
      </header>
      <Button className="section action" href={`/party/${user.id}/preset/add`}>Add a song</Button>
      <div className="section" style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        <h2>Queued Songs</h2>
        <DjSongQueue queuedSongs={presetSongs} />
      </div>
    </Stack>
  );
}