import { Song } from "@prisma/client";

export default function GuestSongQueue({queuedSongs}: {queuedSongs: Song[]}) {
  return (
    <ol>
      {queuedSongs.map(s => {
        return (
          <li key={s.id}>{s.name}</li>
        );
      })}
    </ol>
  );
}