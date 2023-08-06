export default function promiseTimeout<T>(
  promise: Promise<T>,
  duration: number
): Promise<T> {
  const p = new Promise((_, reject) => {
    setTimeout(() => {
      reject("Promise timeout");
    }, duration);
  });

  return Promise.race([p, promise]);
}
