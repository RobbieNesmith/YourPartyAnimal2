import useUserId from "~/hooks/useUserId";

export default function UserIdInput() {
  const userId = useUserId();
  return <input type="hidden" name="userId" value={userId} />
}