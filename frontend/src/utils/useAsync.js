import { useCallback, useEffect, useState } from "react";

/**
 * Loads data when the component mounts and whenever `deps` change.
 * Returns { data, error, loading, reload, setData }.
 */
export function useAsync(load, deps) {
  const [version, setVersion] = useState(0);
  const key = JSON.stringify([...deps, version]);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let alive = true;
    load().then(
      (data) => alive && setResult({ key, data, error: null }),
      (err) => alive && setResult((r) => ({ key, data: r.data, error: err.message })),
    );
    return () => {
      alive = false;
    };
    // `load` is a new function on every render; `key` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (updater) => setResult((r) => ({ ...r, data: typeof updater === "function" ? updater(r.data) : updater })),
    [],
  );

  return { data: result.data, error: result.error, loading: result.key !== key, reload, setData };
}

/** The time the component first rendered, so render functions stay pure. */
export function useNow() {
  const [now] = useState(() => Date.now());
  return now;
}
