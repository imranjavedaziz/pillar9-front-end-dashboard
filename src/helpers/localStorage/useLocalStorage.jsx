"use client";

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const isClient = typeof window !== "undefined";

  const storedValue = isClient ? localStorage.getItem(key) : null;
  const initial =
    isClient && storedValue
      ? key === "profile_info"
        ? JSON.parse(storedValue)
        : storedValue
      : initialValue;

  //   key === "profile_info" ? JSON.stringify(value) : value;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const val = key === "profile_info" ? JSON.stringify(value) : value;
    localStorage.setItem(key, val);
  }, [key, value]);

  const setLocalStorageValue = (newValue) => {
    setValue(newValue);
  };

  const updateLocalStorageValue = (updateFunction) => {
    setValue((prevValue) => {
      const newValue = updateFunction(prevValue);
      return newValue;
    });
  };

  const removeLocalStorageValue = () => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return [
    value,
    setLocalStorageValue,
    updateLocalStorageValue,
    removeLocalStorageValue,
  ];
}