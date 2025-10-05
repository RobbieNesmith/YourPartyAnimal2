import { Guid } from "guid-typescript";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getItemOrNull } from "~/services/LocalStorageService";

export const GuestIdContext = createContext(null as string | null);

export default function useGuestId() {
  const guestIdContext = useContext(GuestIdContext);
  if (typeof window !== "undefined" && window && !guestIdContext) throw new Error("GuestIdProvider not found!");
  return guestIdContext;
}

export function GuestIdProvider({children}: {children: ReactNode}) {
  const [guestId, setGuestId] = useState<string | null>(getItemOrNull("partyanimal-guestid"));
  useEffect(() => {
    if (!guestId) {
      const newGuestId = Guid.create();
      setGuestId(newGuestId.toString());
      localStorage.setItem("partyanimal-guestid", JSON.stringify(newGuestId.toString()));
    }
  }, [guestId]);
  return (
    <GuestIdContext.Provider value={guestId}>
      { children }
    </GuestIdContext.Provider>
  )
}