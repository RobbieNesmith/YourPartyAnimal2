import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { authenticator, secretSession } from "~/services/AuthService.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await secretSession.getSession(request.headers.get("cookie"));
  let user = session.get("user");

  // If the user is already authenticated redirect to the dashboard
  if (user) return redirect(`/party/${user.id}/settings`);

  // Otherwise return null to render the login page
  return typedjson(null);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    // we call the method with the name of the strategy we want to use and the
    // request object
    let user = await authenticator.authenticate("auth0", request);

    let session = await secretSession.getSession(
      request.headers.get("cookie")
    );

    session.set("user", user);

    // Redirect to the home page after successful login
    return redirect("/", {
      headers: {
        "Set-Cookie": await secretSession.commitSession(session),
      },
    });
  } catch (error) {
    // Return validation errors or authentication errors
    if (error instanceof Error) {
      return typedjson({ error: error.message });
    }

    // Re-throw any other errors (including redirects)
    throw error;
  }
}

export default function Login() {
  return(
    <form method="POST">
      <button>Log In</button>
    </form>
  );
}