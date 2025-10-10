import { Button } from "@mui/material";
import { Song } from "@prisma/client";

export default function SongManagement({song}: {song: Song}) {
  return (
    <div className="votingContainer">
      <form action={`/party/${song.user_id}/remove`} method="POST">
        <input type="hidden" name="id" value={song.id} />
        <Button type="submit">X</Button>
      </form>
    </div>
  );
}