import { SearchOutput } from "youtube-search-api-ts";

export default function SearchResultsList({results}: {results: SearchOutput | null}) {

  if (!results) {
    return null;
  }

  if (!results.items.length) {
    return <div>No Results.</div>;
  }

  return (
    <ul>
      {results.items.map(item => <li key={item.id}>{item.title}</li>)}
    </ul>
  );
}