export default function promiseRace<T extends readonly unknown[] | []>(
  iterable: T
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      return;
    }

    iterable.forEach((value: any) =>
      Promise.resolve(value).then(resolve, reject)
    );
  });
}
