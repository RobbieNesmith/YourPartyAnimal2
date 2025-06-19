import { Song } from "@prisma/client";
import "./NowPlaying.css";

export default function NowPlaying({song}: {song: Song | null}) {
  if (!song) {
    return <h2>Nothing Playing Yet</h2>
  }
  return (
    <div className="nowPlaying">
      <h2>Now Playing: {song.name}</h2>
      <img className="thumbnail" src={`https://i.ytimg.com/vi/${song.video_id}/hqdefault.jpg`} />
    </div>
  );
}