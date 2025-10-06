import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { LoginUser } from "~/models/LoginUser";
import { secretSession } from "~/services/AuthService.server";

export async function loader({request}: LoaderFunctionArgs) {
  let session = await secretSession.getSession(request.headers.get("cookie"));
    let loggedInUser = session.get("user") as LoginUser;
  
    if (!loggedInUser) {
      return redirect("/login");
    }

    if (loggedInUser.approved) {
      return redirect(`/party/${loggedInUser.id}/settings`);
    }

    return typedjson(null);
}

export default function RegistrationPending() {
  return (
    <div>
      <h1>Registration Pending</h1>
      <p>Thank you for signing up to be a DJ on YourPartyAnimal!</p>
      <p>
        Once your account is reviewed by us, you will be able to host a party.
        If you're still seeing this page once approved, log out and log back in.
      </p>
      <form action="/logout" method="POST">
        <button>Log Out</button>
      </form>
    </div>
  );
}