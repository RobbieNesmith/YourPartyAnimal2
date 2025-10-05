import { redirect } from "remix-typedjson";

export const action = async () => {
  const {
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    BASE_URL
  } = process.env;

  throw redirect(
    `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`
  );
}

export default function Logout() {
  return (
    <form method="POST">
      <button>Log out</button>
    </form>
  );
}