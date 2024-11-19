import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({params}: LoaderFunctionArgs) {
  return json({userId: params.userId});
}

export default function PartyView() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div>This is where you'll add songs for user {userId}'s party</div>
  );
}