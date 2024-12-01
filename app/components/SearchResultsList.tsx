import { Button, Stack } from "@mui/material";
import { SearchOutput, Video } from "youtube-search-api-ts";

export default function SearchResultsList({partyId, results}: {partyId: number, results: SearchOutput | null}) {

  if (!results) {
    return null;
  }

  if (!results.items.length) {
    return <div>No Results.</div>;
  }

  return (
    <ul>
      {results.items.map(item => <SearchResultItem partyId={partyId} item={item} key={item.id} />)}
    </ul>
  );
}

function SearchResultItem({partyId, item}: {partyId: number, item: Video}) {
  return (
    <li>
      <form action={`/party/${partyId}/queue/add`} method="POST">
        <Stack direction="row">
          <div>{item.title}</div>
          <input type="hidden" name="id" value={item.id} />
          <Button type="submit">Add to Queue</Button>
        </Stack>
      </form>
    </li>
  );
}