import { Outlet } from "@remix-run/react";
import { GuestIdProvider } from "~/hooks/useGuestId";

export default function Party() {
  return (
    <GuestIdProvider>
      <Outlet />
    </GuestIdProvider>
  );
}