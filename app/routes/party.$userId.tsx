import { Button, Stack, TextField } from "@mui/material";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchOutput } from "youtube-search-api-ts";
import SearchResultsList from "~/components/SearchResultsList";
import { prisma } from "~/prisma.server";
import { searchYoutube } from "~/services/YoutubeService";

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
    setResults(await searchYoutube(data.q));
    setTimeout(() => setSearching(false), 1000);
  };

  return (
    <div>
      <h1>Add a song to {user.name}'s party</h1>
      <form onSubmit={handleSubmit(handleSearch)}>
        <Stack direction="row">
          <TextField label="Search" {...register("q", { required: true })} />
          <Button type="submit" disabled={searching}>Search</Button>
        </Stack>
      </form>
      <SearchResultsList results={results} />
    </div>
  );
}