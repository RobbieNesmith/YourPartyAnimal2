export function localStorageExists() {
  return !!(typeof window !== "undefined" && window && "localStorage" in window && localStorage);
}

export function getItemOrNull(item: string) {
  if (localStorageExists()) {
    return JSON.parse(window.localStorage.getItem(item) || "null")
  }
  return null;
}

export const localStorageSchemaVersion = 2;