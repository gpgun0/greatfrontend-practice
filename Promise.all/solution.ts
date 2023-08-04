export default function promiseAll(iterable: Array<any>): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    const result = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(result);
      return;
    }

    iterable.forEach(async (p, i) => {
      try {
        const response = await Promise.resolve(p);
        // const response = await p;
        result[i] = response;
        unresolved -= 1;

        if (unresolved === 0) {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}
