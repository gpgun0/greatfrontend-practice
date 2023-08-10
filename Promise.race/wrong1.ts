export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach((value: any) => {
      resolve(value);
    });
  });
}

// 3 Fail 17 Passed
// promiseRace > multiple promises > all resolve > mixture
// promiseRace > multiple promises > all resolve > many delayed
// promiseRace > multiple promises > mix of resolve and reject > delayed reject
