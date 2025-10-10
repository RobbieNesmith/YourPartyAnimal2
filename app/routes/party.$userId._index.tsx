import { Button, Stack } from "@mui/material";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import GuestSongQueue from "~/components/GuestSongQueue";
import NowPlaying from "~/components/NowPlaying";
import { LoginUser } from "~/models/LoginUser";
import { prisma } from "~/prisma.server";
import { secretSession } from "~/services/AuthService.server";
import { getNowPlaying, getQueuedSongs } from "~/services/QueueService";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let session = await secretSession.getSession(request.headers.get("cookie"));
  let loggedInUser = session.get("user") as LoginUser | null;

  const idNum = parseInt(params.userId || "0");
  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  const nowPlaying = await getNowPlaying(user.id);
  const queuedSongs = await getQueuedSongs(user.id);
  return typedjson({ user, nowPlaying, queuedSongs, loggedIn: !!loggedInUser });
}

export default function PartyView() {
  const { user, nowPlaying, queuedSongs, loggedIn } = useTypedLoaderData<typeof loader>();

  return (
    <Stack sx={{height: "100%"}}>
      <header className="section main">
        <h1>Welcome to {user.name}&apos;s party</h1>
      </header>
      <div className="section">
        <NowPlaying song={nowPlaying} />
      </div>
      <Button className="section action" href={`/party/${user.id}/queue/add`}>Add a song</Button>
      <div className="section" style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        <h2>Queued Songs</h2>
        <GuestSongQueue queuedSongs={queuedSongs} />
      </div>
      {
        loggedIn &&
        <Button className="section action" href={`/party/${user.id}/settings`}>Party Settings</Button>
      }
    </Stack>
  );
}