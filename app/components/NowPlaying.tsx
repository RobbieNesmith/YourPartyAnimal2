import { Song } from "@prisma/client";
import "./NowPlaying.css";

export default function NowPlaying({song}: {song: Song | null}) {
  if (!song) {
    return <div>Nothing yet</div>
  }
  return (
    <div className="nowPlaying">
      <img className="thumbnail" src={`https://i.ytimg.com/vi/${song.video_id}/hqdefault.jpg`} />
      <div>{ song.name }</div>
    </div>
  );
}