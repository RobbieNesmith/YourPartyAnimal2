import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { prisma } from "~/prisma.server";
import { checkLoggedIn } from "~/services/AuthService.server";

export function loader() {
  return new Response("Method Not Allowed!", { status: 405 });
}

export async function action({request, params}: ActionFunctionArgs) {
  const idNum = parseInt(params.userId || "0");

  await checkLoggedIn(request, idNum);

  const user = await prisma.user.findUnique({ where: { id: idNum } });
  if (user == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const songId = form.get("id") as string | null;

  const songIdNum = parseInt(songId || "0");

  const song = await prisma.song.findUnique({ where: { id: songIdNum }});

  if (song == null || song.user_id !== user.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const deletedSong = await prisma.song.delete({ where: { id: songIdNum }});

  const destination = deletedSong.preset ? "preset" : "queue";

  return redirect(`/party/${user.id}/manage/${destination}`);
}