import { Song } from "@prisma/client";
import "./GuestSongQueue.css";

export default function GuestSongQueue({queuedSongs}: {queuedSongs: Song[]}) {
  return (
    <ol className="queueList">
      {queuedSongs.map(s => {
        return (
          <li className="queueItem" key={s.id}>{s.name}</li>
        );
      })}
    </ol>
  );
}