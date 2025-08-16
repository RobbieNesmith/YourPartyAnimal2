import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import "./SongVoting.css";
import { useParams } from "@remix-run/react";
import { getItemOrNull } from "~/services/LocalStorageService";

export default function SongVoting({songId, songRating}: {songId: number, songRating: number}) {
  const [internalRating, setInternalRating] = useState(songRating);
  const {userId} = useParams();
  const localVote = parseInt(getItemOrNull(`partyanimal-voted-${songId}`) || "0");
  const [vote, setVote] = useState(localVote);

  useEffect(() => {
    localStorage.setItem(`partyanimal-voted-${songId}`, `${vote}`);
  }, [vote, songId]);

  const voteUp = useCallback(async () => {
    if (vote <= 0) {
      const fd = new FormData();
      fd.set("action", "up");
      await fetch(`/party/${userId}/vote/${songId}`, {
        method: "POST",
        body: fd
      });
      setInternalRating(ir => ir + 1);
      setVote(v => v + 1);
    }
  }, [userId, songId, vote]);

  const voteDown = useCallback(async () => {
    if (vote >= 0) {
      const fd = new FormData();
      fd.set("action", "down");
      await fetch(`/party/${userId}/vote/${songId}`, {
        method: "POST",
        body: fd
      });
      setInternalRating(ir => ir - 1);
      setVote(v => v - 1);
    }
  }, [userId, songId, vote]);

  return (
    <div className="votingContainer">
      <Button
        onClick={voteUp}
        disabled={vote > 0}
      >+</Button>
      <div className="songScore">{internalRating}</div>
      <div style={{display: "none"}}>{vote}</div>
      <Button
        onClick={voteDown}
        disabled={vote < 0}
      >-</Button>
    </div>
  );
}