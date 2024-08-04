import { useEffect, useState } from "react";

const useLocalStorage = <T extends object>(key: string) => {
  const [storage, _setStorage] = useState<T>({} as unknown as T);
  useEffect(() => {
    const handleStorage = () => {
      _setStorage(JSON.parse(localStorage.getItem(key) ?? "{}"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const setStorage = (data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("storage"));
  };
  return [storage, setStorage];
};

export default useLocalStorage;
