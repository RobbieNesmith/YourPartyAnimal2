import { SearchOutput } from "youtube-search-api-ts";
import SearchResultsEntry from "./SearchResultsEntry";

interface SearchResultsListProps {
  partyId: number;
  results: SearchOutput | null;
  destination: "queue" | "preset";
}

export default function SearchResultsList({partyId, results, destination}: SearchResultsListProps) {

  if (!results) {
    return null;
  }

  if (!results.items.length) {
    return <div>No Results.</div>;
  }

  return (
    <div className="inset" style={{ overflow: "auto"}}>
      <ul className="queueList">
        {results.items.map(item => <SearchResultsEntry partyId={partyId} item={item} key={item.id} destination={destination} />)}
      </ul>
    </div>
  );
}