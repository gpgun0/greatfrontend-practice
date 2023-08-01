export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach(async (value: any) => {
      if (value instanceof Promise) {
        try {
          const res = await value;
          resolve(res);
        } catch (err) {
          reject(err);
        }
      } else {
        // resolve(Promise.resolve(3)) is equal to resolve(3)
        resolve(value);
      }
    });
  });
}

// 1 Fail 19 Passed
// promiseRace > multiple promises > all resolve > mixture
