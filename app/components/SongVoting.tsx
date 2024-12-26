import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import "./SongVoting.css";
import { useParams } from "@remix-run/react";

export default function SongVoting({songId, songRating}: {songId: number, songRating: number}) {
  const [internalRating, setInternalRating] = useState(songRating);
  const {userId} = useParams();
  const voteUp = useCallback(async () => {
    const fd = new FormData();
    fd.set("action", "up");
    await fetch(`/party/${userId}/vote/${songId}`, {
      method: "POST",
      body: fd
    });
    setInternalRating(ir => ir + 1)
  }, [songId]);

  const voteDown = useCallback(async () => {
    const fd = new FormData();
    fd.set("action", "down");
    await fetch(`/party/${userId}/vote/${songId}`, {
      method: "POST",
      body: fd
    });
    setInternalRating(ir => ir - 1)
  }, [songId]);

  return (
    <div className="votingContainer">
      <Button onClick={voteUp}>+</Button>
      <div className="songScore">{internalRating}</div>
      <Button onClick={voteDown}>-</Button>
    </div>
  );
}