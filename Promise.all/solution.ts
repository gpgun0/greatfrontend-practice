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
        // const response = await p; // 테스트 케이스를 통과하지만 await은 Promise 앞에만 써야한다.
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
