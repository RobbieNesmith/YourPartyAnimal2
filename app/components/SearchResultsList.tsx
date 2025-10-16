import { SearchOutput } from "youtube-search-api-ts";
import SearchResultsEntry from "./SearchResultsEntry";

interface SearchResultsListProps {
  partyId: number;
  results: SearchOutput | null;
  destination: "queue" | "preset";
  enforceMaxLength: boolean;
  maxLength: number;
}

export default function SearchResultsList({partyId, results, destination, enforceMaxLength, maxLength}: SearchResultsListProps) {

  if (!results) {
    return null;
  }

  if (!results.items.length) {
    return <div>No Results.</div>;
  }

  return (
    <div className="inset" style={{ overflow: "auto"}}>
      <ul className="queueList">
        {results.items.map(item => {
          return (
            <SearchResultsEntry
              partyId={partyId}
              item={item}
              key={item.id}
              destination={destination}
              enforceMaxLength={enforceMaxLength}
              maxLength={maxLength}
            />)
        })}
      </ul>
    </div>
  );
}