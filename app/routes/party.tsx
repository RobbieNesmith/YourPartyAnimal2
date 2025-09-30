import { Outlet } from "@remix-run/react";
import { UserIdProvider } from "~/hooks/useUserId";

export default function Party() {
  return (
    <UserIdProvider>
      <Outlet />
    </UserIdProvider>
  );
}