'use client';

import { useState, useEffect, useCallback } from 'react';

// This is a custom hook that allows you to use localStorage with React state.
// It's a bit complex, but it's a good example of how to create a custom hook.
// We're using a generic type `T` so that we can use this hook with any type of data.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // The `readValue` function is responsible for reading the value from localStorage.
  // We're using `useCallback` to memoize the function so that it's not recreated on every render.
  const readValue = useCallback((): T => {
    // We need to check if `window` is defined because this code will also run on the server, where `window` is not defined.
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // If the item exists, we parse it from JSON. Otherwise, we return the initial value.
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // We use `useState` to store the current value.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // The `setValue` function is responsible for updating the value in both state and localStorage.
  // It can accept a value or a function that receives the previous value.
  const setValue = (value: T | ((val: T) => T)) => {
    // We need to check if `window` is defined, just like in `readValue`.
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // This `useEffect` hook will run once when the component mounts.
  // It's responsible for reading the initial value from localStorage.
  useEffect(() => {
    setStoredValue(readValue());
    // We disable the eslint warning here because we only want to run this effect once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue];
}
