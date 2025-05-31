import { Song } from "@prisma/client";
import GuestSongEntry from "./GuestSongEntry";

export default function GuestSongQueue({queuedSongs}: {queuedSongs: Song[]}) {
  return (
    <ol className="queueList">
      {queuedSongs.map(s => <GuestSongEntry key={s.id} song={s} />)}
    </ol>
  );
}