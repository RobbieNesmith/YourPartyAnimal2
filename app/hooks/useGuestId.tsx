import { Guid } from "guid-typescript";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getItemOrNull } from "~/services/LocalStorageService";

export const UserIdContext = createContext(null as string | null);

export default function useGuestId() {
  const userIdContext = useContext(UserIdContext);
  if (!userIdContext) throw new Error("UserIdProvider not found!");
  return userIdContext;
}

export function GuestIdProvider({children}: {children: ReactNode}) {
  const [guestId, setGuestId] = useState<string | null>(getItemOrNull("partyanimal-guestid"));
  useEffect(() => {
    if (!guestId) {
      const newUserId = Guid.create();
      setGuestId(newUserId.toString());
      localStorage.setItem("partyanimal-guestid", JSON.stringify(newUserId.toString()));
    }
  }, [guestId]);
  return (
    <UserIdContext.Provider value={guestId}>
      { children }
    </UserIdContext.Provider>
  )
}