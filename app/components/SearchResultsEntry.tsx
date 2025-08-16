import { Button } from "@mui/material";
import { Video } from "youtube-search-api-ts";
import ListItem from "./ListItem";

export default function SearchResultsEntry({partyId, item}: {partyId: number, item: Video}) {
  return (
    <ListItem key={item.id!} imageUrl={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} title={item.title!}>
      <form action={`/party/${partyId}/queue/add`} method="POST">
        <input type="hidden" name="id" value={item.id} />
        <Button type="submit">Add to Queue</Button>
      </form>
    </ListItem>
  );
}