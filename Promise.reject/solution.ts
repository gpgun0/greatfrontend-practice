export default function promiseReject(reason: any): Promise<any> {
  return new Promise((_, reject) => {
    reject(reason);
  });
}
