import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchOutput, YoutubeSearchApi } from "youtube-search-api-ts";
import { enqueueSong } from "~/services/QueueService";
import { searchYoutube } from "~/services/YoutubeService";
import { prisma } from "~/prisma.server";
import { Button, Stack, TextField } from "@mui/material";
import SearchResultsList from "~/components/SearchResultsList";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ params }: LoaderFunctionArgs) {
  var idNum = parseInt(params.userId || "0");
  var user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  return typedjson({ user });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = params.userId;
  if (!userId) {
    throw new Response("Not Found", { status: 404 });
  }
  const userIdInt = parseInt(userId);

  if (!userIdInt) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const id = form.get("id") as string | null;
  if (!id) {
    throw new Response("ID is required", { status: 400 });
  }
  const api = new YoutubeSearchApi();
  const videoDetails = await api.getVideoDetails(id);

  await enqueueSong(userIdInt, videoDetails.id, videoDetails.title);

  return redirect(`/party/${userId}`);
}

type SearchFormInputs = {
  q: string;
};

export default function AddToQueueView() {
  const { user } = useTypedLoaderData<typeof loader>();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null as SearchOutput | null);
  const { handleSubmit, register } = useForm<SearchFormInputs>();

  const handleSearch: SubmitHandler<SearchFormInputs> = async (data) => {
    setSearching(true);
    setResults(await searchYoutube(data.q));
    setTimeout(() => setSearching(false), 1000);
  };

  return (
    <Stack sx={{height: "100%"}}>
      <header className="section main">
        <h1>Add a song to {user.name}'s party</h1>
      </header>
      <form onSubmit={handleSubmit(handleSearch)}>
        <Stack direction="row">
          <div style={{ flexGrow: 1 }} className="section">
            <TextField sx={{backgroundColor: "white"}} fullWidth label="Search" {...register("q", { required: true })} />
          </div>
          <Button className="section action" type="submit" disabled={searching}>Search</Button>
        </Stack>
      </form>
      <Stack direction="column" className="section" style={{flexGrow: 1, overflow: "hidden"}}>
        <SearchResultsList partyId={user.id} results={results} />
      </Stack>
      <Button className="section action" href={`/party/${user.id}`}>Back</Button>
    </Stack>
  );
}