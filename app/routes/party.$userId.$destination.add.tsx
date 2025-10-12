import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchOutput } from "youtube-search-api-ts";
import { enqueueSong, hasPartyStoppedRequests, isSongAlreadyQueued } from "~/services/QueueService";
import { searchYoutube } from "~/services/YoutubeService";
import { prisma } from "~/prisma.server";
import { Button, Stack, TextField } from "@mui/material";
import SearchResultsList from "~/components/SearchResultsList";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { checkLoggedIn } from "~/services/AuthService.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const destination = params.destination;

  if (destination != "queue" && destination != "preset") {
    throw typedjson({ title: "User Not Found", message: "You can't put a song there." }, { status: 404 });
  }

  const idNum = parseInt(params.userId || "0");

  if (destination === "preset") {
    await checkLoggedIn(request, idNum);
  }

  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw typedjson({ title: "Party Not Found", message: "You're trying to go to a party that doesn't exist."}, {status: 404});
  }
  return typedjson({ user, destination: destination as "queue" | "preset" });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const destination = params.destination;

  if (destination != "queue" && destination != "preset") {
    throw typedjson({ title: "Invalid song destination", message: "You can't put a song there." }, { status: 404 });
  }

  const userId = params.userId;
  if (!userId) {
    throw typedjson({ title: "Party Not Found", message: "You're trying to go to a party that doesn't exist." }, { status: 404 });
  }
  const userIdInt = parseInt(userId);

  if (destination === "preset") {
    await checkLoggedIn(request, userIdInt);
  }

  if (!userIdInt) {
    throw typedjson({ title: "Party Not Found", message: "You're trying to go to a party that doesn't exist." }, { status: 404 });
  }

  const form = await request.formData();
  const id = form.get("id") as string | null;
  if (!id) {
    throw typedjson({ title: "Song not provided", message: "You have to say what song you want to add." }, { status: 400 });
  }
  const title = form.get("title") as string | null;
  if (!title) {
    throw typedjson({ title: "Song title not provided", message: "You may be using an outdated version. Try refreshing your browser." }, { status: 400 })
  }
  const guestId = form.get("guestId") as string | null;
  if (destination === "queue") {
    if (!guestId) {
      throw typedjson({ title: "Guest Not Found", message: "Who are you?" }, { status: 404 });
    }

    const stoppedRequests = await hasPartyStoppedRequests(userIdInt);
    if (stoppedRequests) {
      throw typedjson({ title: "Requests Stopped", message: "This party is no longer accepting requests." }, {status: 403});
    }

    const songAlreadyQueued = await isSongAlreadyQueued(userIdInt, id);
    if (songAlreadyQueued) {
      throw typedjson({ title: "Song Already Requested", message: "That song has already been requested." }, {status: 400});
    }
  }

  await enqueueSong(userIdInt, id, title, guestId, destination === "preset");

  if (destination === "preset") {
    return redirect(`/party/${userId}/manage/preset`);
  }
  return redirect(`/party/${userId}`);
}

type SearchFormInputs = {
  q: string;
};

export default function AddToQueueView() {
  const { user, destination } = useTypedLoaderData<typeof loader>();
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
        <h1>Add a song to {user.name}&apos;s party</h1>
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
        <SearchResultsList partyId={user.id} results={results} destination={destination} />
      </Stack>
      <Button className="section action" href={`/party/${user.id}`}>Back</Button>
    </Stack>
  );
}