import { Song } from "@prisma/client";
import ListItem from "./ListItem";
import SongManagement from "./SongManagement";

export default function GuestSongEntry({song}: {song: Song}) {
  return (
    <ListItem
      key={song.id}
      imageUrl={`https://i.ytimg.com/vi/${song.video_id}/hqdefault.jpg`}
      title={song.name}>
      <SongManagement song={song} />
    </ListItem>
  );
}