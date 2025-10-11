import { Song } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { LoginUser } from "~/models/LoginUser";
import { prisma } from "~/prisma.server";
import { secretSession } from "~/services/AuthService.server";
import { getNowPlaying } from "~/services/QueueService";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const YouTubeElement: typeof YouTube = YouTube.default ?? YouTube;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const idNum = parseInt(params.userId || "0");

  let session = await secretSession.getSession(request.headers.get("cookie"));
  let loggedInUser = session.get("user") as LoginUser;

  if (!loggedInUser || loggedInUser.id != idNum) {
    return redirect("/login");
  }

  if (!loggedInUser.approved) {
    return redirect("/registrationPending");
  }

  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  const nowPlaying = await getNowPlaying(user.id);
  return typedjson({ user, nowPlaying });
}

export default function DjPartyView() {
  const {user, nowPlaying} = useTypedLoaderData<typeof loader>();
  const [actualNowPlaying, setActualNowPlaying] = useState(nowPlaying);

  const getNextSong = useCallback(async () => {
    const queuedSongsResponse = await fetch(`/jukebox/${user.id}/getQueuedSongs`);
    const queuedSongs = await queuedSongsResponse.json() as Song[];
    const nextSong = queuedSongs[1];
    await fetch(`/jukebox/${user.id}/markNowPlaying/${nextSong.id}`,
      {method: "POST"}
    );
    setActualNowPlaying(nextSong);
  }, [user.id, actualNowPlaying, setActualNowPlaying]);

  useEffect(() => {
    if (!actualNowPlaying) {
      getNextSong();
    }
  }, [actualNowPlaying, getNextSong]);

  if (!actualNowPlaying) {
    return "Nothing to see here";
  }

  return (
    <div>
      <h1>{user.name}&apos;s Party</h1>
      <YouTubeElement
        opts={{playerVars: {autoplay: 1}}}
        videoId={actualNowPlaying?.video_id}
        onEnd={getNextSong}
      />
    </div>
  )
}