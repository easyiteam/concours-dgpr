import { useEffect, useState } from 'react';

export type UseFetchArgs<T> = {
  defaultValue: T;
  cb: (...args: never[]) => Promise<T>;
};

export function useFetch<T>({ defaultValue, cb }: UseFetchArgs<T>) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      const result = await cb();
      console.log('result', result);
      setData(result);
      setLoading(false);
    };

    fn();
  }, []);

  return { data, loading };
}
