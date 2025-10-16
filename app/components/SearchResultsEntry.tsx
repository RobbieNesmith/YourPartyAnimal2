import { Button } from "@mui/material";
import { Video } from "youtube-search-api-ts";
import ListItem from "./ListItem";
import GuestIdInput from "./GuestIdInput";

interface SearchResultsEntryProps {
  partyId: number;
  item: Video;
  destination: "queue" | "preset";
  enforceMaxLength: boolean;
  maxLength: number;
}

interface VideoLength {
  accessibility: {
    accessibilityData: {
      label: string
    }
  }
  simpleText: string;
}

function parseDurationToMinutes(durationStr: string): number {
  const parts = durationStr.split(":");
  let duration = 0;
  if (parts.length === 3) {
    duration += parseInt(parts[0]) * 60;
  }
  duration += parseInt(parts[parts.length - 2]);
  duration += parseInt(parts[parts.length - 1]) / 60;
  return duration;
}

export default function SearchResultsEntry({partyId, item, destination, enforceMaxLength, maxLength}: SearchResultsEntryProps) {
  const buttonText = destination == "queue" ? "Add to Queue" : "Add Preset";

  const lengthCorrectType = item.length as unknown as VideoLength;

  let contents = <div>Too Long!</div>;
  if (!enforceMaxLength || parseDurationToMinutes(lengthCorrectType.simpleText) < maxLength) {
    contents = <form action={`/party/${partyId}/${destination}/add`} method="POST">
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="title" value={item.title} />
      <GuestIdInput />
      <Button type="submit">{buttonText}</Button>
    </form>;
  }

  return (
    <ListItem key={item.id!} imageUrl={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} title={`${item.title!} - ${lengthCorrectType.simpleText}`}>
      { contents }
    </ListItem>
  );
}