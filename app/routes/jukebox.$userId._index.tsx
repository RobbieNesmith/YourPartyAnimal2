import { Song } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { prisma } from "~/prisma.server";
import { getNowPlaying } from "~/services/QueueService";


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
  return typedjson({ user, nowPlaying });
}

export default function DjPartyView() {
  const {user, nowPlaying} = useTypedLoaderData<typeof loader>();
  const [actualNowPlaying, setActualNowPlaying] = useState(nowPlaying);

  const getNextSong = useCallback(async () => {
    const queuedSongsResponse = await fetch(`/jukebox/${user.id}/getQueuedSongs`);
    const queuedSongs = await queuedSongsResponse.json() as Song[];
    const nextSong = queuedSongs[1];
    if (actualNowPlaying) {
      await fetch(`/jukebox/${user.id}/markPlayed/${actualNowPlaying.id}`,
        {method: "POST"}
      );
    }
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