import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useUrlState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = (value) => String(value),
  deserialize: (value: string) => T = (value) => value as T
) {
  // Ensure serialize and deserialize are functions
  const safeSerialize = useMemo(
    () =>
      typeof serialize === "function" ? serialize : (value: T) => String(value),
    [serialize]
  );
  const safeDeserialize = useMemo(
    () =>
      typeof deserialize === "function"
        ? deserialize
        : (value: string) => value as T,
    [deserialize]
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultValueRef = useRef(defaultValue);

  // Update ref when defaultValue changes
  if (defaultValueRef.current !== defaultValue) {
    defaultValueRef.current = defaultValue;
  }

  const [state, setState] = useState<T>(() => {
    const urlValue = searchParams.get(key);
    return urlValue ? safeDeserialize(urlValue) : defaultValue;
  });

  // Memoize the current URL value to prevent unnecessary re-renders
  const currentUrlValue = useMemo(
    () => searchParams.get(key),
    [searchParams, key]
  );

  const updateState = useCallback(
    (newValue: T) => {
      setState(newValue);
      const params = new URLSearchParams(searchParams.toString());

      // Check if the value should be removed from URL
      const shouldRemove =
        newValue === defaultValueRef.current ||
        (Array.isArray(newValue) && newValue.length === 0) ||
        (typeof newValue === "string" && newValue.trim() === "") ||
        (typeof newValue === "string" && newValue === "") ||
        (typeof newValue === "boolean" && newValue === false);

      if (shouldRemove) {
        params.delete(key);
      } else {
        try {
          params.set(key, safeSerialize(newValue));
        } catch (error) {
          console.error("Error serializing value:", error);
          return;
        }
      }

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.replace(newUrl, { scroll: false });
    },
    [key, safeSerialize, searchParams, router]
  );

  // Sync from URL to state
  useEffect(() => {
    if (currentUrlValue !== null) {
      try {
        const newState = safeDeserialize(currentUrlValue);
        setState(newState);
      } catch (error) {
        console.error("Error deserializing URL value:", error);
        setState(defaultValueRef.current);
      }
    } else {
      // If no URL parameter exists, ensure state is set to default
      setState(defaultValueRef.current);
    }
  }, [currentUrlValue, safeDeserialize, key]);

  return [state, updateState] as const;
}
