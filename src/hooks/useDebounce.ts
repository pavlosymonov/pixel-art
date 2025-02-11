import { DependencyList, useEffect } from "react";

export function useDebounceEffect(
  fn: () => void,
  deps: DependencyList = [],
  delay: number,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();
    }, delay);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
