import { useEffect, useState } from "react";
import { getItemOrNull } from "~/services/LocalStorageService";

export default function UserIdManager() {
  const [userId, setUserId] = useState<string | null>(getItemOrNull("partyanimal-userid"));
  useEffect(() => {
    if (userId === null) {
      localStorage.setItem("partyanimal-userid", '"test"');
      setUserId("test");
    }
  }, [userId]);

  if (!userId) {
    return null;
  }
  return <input type="hidden" name="userId" value={userId} />
}