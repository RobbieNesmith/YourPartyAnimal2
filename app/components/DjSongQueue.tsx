import { Song } from "@prisma/client";
import DjSongEntry from "./DjSongEntry";

export default function GuestSongQueue({queuedSongs}: {queuedSongs: Song[]}) {
  return (
    <div className="inset" style={{flexGrow: 1, overflow: "auto"}}>
      <ol className="queueList">
        {queuedSongs.map(s => <DjSongEntry key={s.id} song={s} />)}
      </ol>
    </div>
  );
}