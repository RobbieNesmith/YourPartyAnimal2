import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchOutput } from "youtube-search-api-ts";
import SearchResultsList from "~/components/SearchResultsList";
import { prisma } from "~/prisma.server";

export async function loader({ params }: LoaderFunctionArgs) {
  var idNum = parseInt(params.userId || "0");
  var user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  return json({ user });
}

type SearchFormInputs = {
  q: string;
};

export default function PartyView() {
  const { user } = useLoaderData<typeof loader>();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null as SearchOutput | null);
  const { handleSubmit, register } = useForm<SearchFormInputs>();

  const handleSearch: SubmitHandler<SearchFormInputs> = async (data) => {
    setSearching(true);
    const searchResponse = await fetch("/search?" + new URLSearchParams({q: data.q}));
    setResults(await searchResponse.json() as SearchOutput);
    setTimeout(() => setSearching(false), 1000);
  };

  return (
    <div>
      <div>This is where you'll add songs for user {user.name}'s party</div>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div>
          <input {...register("q", {required: true})} />
          <button disabled={searching}>Search</button>
        </div>
      </form>
      <SearchResultsList results={results} />
    </div>
  );
}