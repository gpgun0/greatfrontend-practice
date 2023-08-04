export default function promiseAll(iterable: Array<any>): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    const result = [];
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(result);
      return;
    }

    iterable.forEach(async (p) => {
      try {
        const response = await Promise.resolve(p);
        result.push(response);
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
