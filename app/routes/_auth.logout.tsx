import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { secretSession } from "~/services/AuthService.server";

export async function action({request}: ActionFunctionArgs) {
  const {
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    BASE_URL
  } = process.env;

  const session = await secretSession.getSession(
    request.headers.get("Cookie")
  );

  throw redirect(
    `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`,
    {
      headers: {
        "Set-Cookie": await secretSession.destroySession(session),
      },
    }
  );
}

export default function Logout() {
  return (
    <form method="POST">
      <button>Log out</button>
    </form>
  );
}