import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useUrlState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = (value) => String(value),
  deserialize: (value: string) => T = (value) => value as T
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<T>(() => {
    const urlValue = searchParams.get(key);
    return urlValue ? deserialize(urlValue) : defaultValue;
  });

  const updateState = useCallback(
    (newValue: T) => {
      setState(newValue);
      const params = new URLSearchParams(searchParams.toString());

      if (
        newValue === defaultValue ||
        (Array.isArray(newValue) && newValue.length === 0)
      ) {
        params.delete(key);
      } else {
        params.set(key, serialize(newValue));
      }

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.replace(newUrl, { scroll: false });
    },
    [key, defaultValue, serialize, searchParams, router]
  );

  // Only sync from URL to state, not the other way around
  useEffect(() => {
    const urlValue = searchParams.get(key);
    if (urlValue !== null) {
      const newState = deserialize(urlValue);
      setState(newState);
    }
  }, [key, searchParams, deserialize]);

  return [state, updateState] as const;
}
