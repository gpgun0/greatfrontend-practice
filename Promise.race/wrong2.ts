export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach(async (value: any) => {
      try {
        if (value instanceof Promise) {
          const res = await value;
          resolve(res);
        } else {
          resolve(value);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

// 1 Fail 19 Passed
// promiseRace > multiple promises > all resolve > mixture
