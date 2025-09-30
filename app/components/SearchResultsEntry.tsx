import { Button } from "@mui/material";
import { Video } from "youtube-search-api-ts";
import ListItem from "./ListItem";
import GuestIdInput from "./GuestIdInput";

interface SearchResultsEntryProps {
  partyId: number;
  item: Video;
  destination: "queue" | "preset";
}

export default function SearchResultsEntry({partyId, item, destination}: SearchResultsEntryProps) {
  const buttonText = destination == "queue" ? "Add to Queue" : "Add Preset";

  return (
    <ListItem key={item.id!} imageUrl={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} title={item.title!}>
      <form action={`/party/${partyId}/${destination}/add`} method="POST">
        <input type="hidden" name="id" value={item.id} />
        <GuestIdInput />
        <Button type="submit">{buttonText}</Button>
      </form>
    </ListItem>
  );
}