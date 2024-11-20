import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/prisma.server";

export async function loader({params}: LoaderFunctionArgs) {
  var idNum = parseInt(params.userId || "0");
  var user = await prisma.user.findUnique({where: {id: idNum}});
  if (user == null) {
    throw new Response("User not found.", {status: 404});
  }
  return json({user});
}

export default function PartyView() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>This is where you'll add songs for user {user.name}'s party</div>
  );
}