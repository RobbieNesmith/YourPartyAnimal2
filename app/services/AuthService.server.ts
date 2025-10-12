import { jwtDecode, JwtPayload } from "jwt-decode";
import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { LoginUser } from "~/models/LoginUser";
import { findOrCreate } from "./UserService.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
  BASE_URL,
  SESSION_SECRET,
} = process.env;

if (!AUTH0_CLIENT_ID) throw new Error("Missing AUTH0_CLIENT_ID!");
if (!AUTH0_CLIENT_SECRET) throw new Error("Missing AUTH0_CLIENT_SECRET!");
if (!AUTH0_DOMAIN) throw new Error("Missing AUTH0_DOMAIN!");
if (!BASE_URL) throw new Error("Missing BASE_URL!");
if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET!");

export const secretSession = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<LoginUser>();

export let auth0Strategy = new Auth0Strategy(
  {
    redirectURI: `${BASE_URL}/auth/callback`,
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
    scopes: ["openid", "email"]
  },
  async ({ tokens, request }) => {
    const idInfo = jwtDecode(tokens.idToken()) as JwtPayload & {email?: string, partyanimal_roles: string[]};
    if (!idInfo.sub || !idInfo.email) {
      throw new Error("User info not provided");
    }
    const user = await findOrCreate(idInfo.sub, idInfo.email, idInfo.partyanimal_roles);
    return {...user, accessToken: tokens.accessToken()}
  }
);

authenticator.use(auth0Strategy);

export async function checkLoggedIn(request: Request, userId: number) {
  let session = await secretSession.getSession(request.headers.get("cookie"));
  let loggedInUser = session.get("user") as LoginUser;

  if (!loggedInUser || loggedInUser.id !== userId) {
    throw redirect("/login");
  }

  if (!loggedInUser.approved) {
    throw redirect("/registrationPending");
  }
}