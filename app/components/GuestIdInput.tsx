import useGuestId from "~/hooks/useGuestId";

export default function GuestIdInput() {
  const guestId = useGuestId();
  return <input type="hidden" name="guestId" value={guestId} />
}