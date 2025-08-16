import { SearchOutput } from "youtube-search-api-ts";
import SearchResultsEntry from "./SearchResultsEntry";

export default function SearchResultsList({partyId, results}: {partyId: number, results: SearchOutput | null}) {

  if (!results) {
    return null;
  }

  if (!results.items.length) {
    return <div>No Results.</div>;
  }

  return (
    <div className="inset" style={{ overflow: "auto"}}>
      <ul className="queueList">
        {results.items.map(item => <SearchResultsEntry partyId={partyId} item={item} key={item.id} />)}
      </ul>
    </div>
  );
}