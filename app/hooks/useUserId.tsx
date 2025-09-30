import { Guid } from "guid-typescript";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getItemOrNull } from "~/services/LocalStorageService";

export const UserIdContext = createContext(null as string | null);

export default function useUserId() {
  const userIdContext = useContext(UserIdContext);
  if (!userIdContext) throw new Error("UserIdProvider not found!");
  return userIdContext;
}

export function UserIdProvider({children}: {children: ReactNode}) {
  const [userId, setUserId] = useState<string | null>(getItemOrNull("ypa2-userid"));
  useEffect(() => {
    if (!userId) {
      const newUserId = Guid.create();
      setUserId(newUserId.toString());
      localStorage.setItem("ypa2-userid", JSON.stringify(newUserId.toString()));
    }
  }, [userId]);
  return (
    <UserIdContext.Provider value={userId}>
      { children }
    </UserIdContext.Provider>
  )
}