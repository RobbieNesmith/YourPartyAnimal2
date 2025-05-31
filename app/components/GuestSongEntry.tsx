import { Song } from "@prisma/client";
import SongVoting from "./SongVoting";
import ListItem from "./ListItem";

export default function GuestSongEntry({song}: {song: Song}) {
  return (
    <ListItem
      key={song.id}
      imageUrl={`https://i.ytimg.com/vi/${song.video_id}/hqdefault.jpg`}
      title={song.name}>
      <SongVoting
        songId={song.id}
        songRating={song.rating}
      />
    </ListItem>
  );
}