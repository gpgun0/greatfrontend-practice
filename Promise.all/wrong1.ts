export default function promiseAll(iterable: Array<any>): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    const result = [];

    iterable.forEach(async (p, i) => {
      try {
        const response = await Promise.resolve(p);
        result[i] = response;
      } catch (err) {
        reject(err);
      }
    });

    resolve(result);
  });
}
