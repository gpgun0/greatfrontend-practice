export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach(async (value: any) => {
      try {
        const response = await value;
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  });
}
