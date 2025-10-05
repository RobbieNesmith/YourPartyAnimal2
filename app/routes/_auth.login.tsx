import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/AuthService.server";

export let loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("auth0", request);
};