import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { prisma } from "~/prisma.server";
import { getNowPlaying, getQueuedSongs } from "~/services/QueueService";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const YouTubeElement: typeof YouTube = YouTube.default ?? YouTube;

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
  const [actualNowPlaying, setActualNowPlaying] = useState(nowPlaying);
  const [actualQueue, setActualQueue] = useState(queuedSongs);

  const getNextSong = useCallback(async () => {
    const nextSong = actualQueue[0];
    if (actualNowPlaying) {
      await fetch(`/jukebox/${user.id}/markPlayed/${actualNowPlaying.id}`,
        {method: "POST"}
      );
    }
    setActualQueue(aq => aq.slice(1));
    setActualNowPlaying(nextSong);
  }, [actualQueue, setActualNowPlaying, setActualQueue]);

  useEffect(() => {
    if (!actualNowPlaying) {
      getNextSong();
    }
  }, [actualNowPlaying]);

  if (!actualNowPlaying) {
    return "Nothing to see here";
  }

  return (
    <div>
      <h1>{user.name}'s Party</h1>
      <YouTubeElement
        opts={{playerVars: {autoplay: 1}}}
        videoId={actualNowPlaying?.video_id}
        onEnd={getNextSong}
      />
    </div>
  )
}