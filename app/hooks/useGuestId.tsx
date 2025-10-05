import { Guid } from "guid-typescript";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getItemOrNull } from "~/services/LocalStorageService";

interface GuestIdContextState {
  guestId: string | null;
}

export const GuestIdContext = createContext(null as GuestIdContextState | null);

export default function useGuestId() {
  const guestIdContext = useContext(GuestIdContext);
  if (typeof window !== "undefined" && window && !guestIdContext) throw new Error("GuestIdProvider not found!");
  return guestIdContext?.guestId;
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

  const guestIdState = useMemo(() => ({guestId}), [guestId]);

  return (
    <GuestIdContext.Provider value={guestIdState}>
      { children }
    </GuestIdContext.Provider>
  )
}