import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import "./SongVoting.css";

export default function SongVoting({songId, songRating}: {songId: number, songRating: number}) {
  const [internalRating, setInternalRating] = useState(songRating);

  const voteUp = useCallback(() => {
    // call to backend to update rating
    setInternalRating(ir => ir + 1)
  }, [songId]);

  const voteDown = useCallback(() => {
  // call to backend to update rating
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