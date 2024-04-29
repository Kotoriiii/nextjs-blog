import React, { useEffect, useState } from "react";

type Data<T> = T | null;

const useReadLocalStorage = <T>(key: string): Data<T> => {
  const readValue = React.useCallback((): Data<T> => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    } catch (err) {
        console.warn(`Error reading locaStorage key "${key}:"`, err);
        return null;
    }
  },[key]);

  const [storedValue, setStoredValue] = useState<Data<T>>(readValue);

  const handleStorageChange = React.useCallback(
    (event: Event) => {
      if ((event as CustomEvent).detail.key && (event as CustomEvent).detail.key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEffect(() => {
    window.addEventListener('local-storage', handleStorageChange);
    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  return storedValue;
};

export default useReadLocalStorage;
