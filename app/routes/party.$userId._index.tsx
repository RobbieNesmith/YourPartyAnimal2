import { Button, Stack } from "@mui/material";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/prisma.server";

export async function loader({ params }: LoaderFunctionArgs) {
  var idNum = parseInt(params.userId || "0");
  var user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("User not found.", { status: 404 });
  }
  return json({ user });
}

export default function PartyView() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Stack>
      <h1>Welcome to {user.name}'s party</h1>
      <div>
        <h2>Now Playing</h2>
      </div>
      <Button href={`/party/${user.id}/queue/add`}>Add a song</Button>
      <div>
        <h2>Queued Songs</h2>
      </div>
    </Stack>
  );
}