import { Song } from "@prisma/client";
import "./GuestSongQueue.css";
import SongVoting from "./SongVoting";

export default function GuestSongQueue({queuedSongs}: {queuedSongs: Song[]}) {
  return (
    <ol className="queueList">
      {queuedSongs.map(s => {
        return (
          <li className="queueItem" key={s.id}>
            <img className="thumbnail" src={`https://i.ytimg.com/vi/${s.video_id}/hqdefault.jpg`} />
            <div className="centerContainer">
              <span>{s.name}</span>
            </div>
            <SongVoting songId={s.id} songRating={s.rating} />
          </li>
        );
      })}
    </ol>
  );
}