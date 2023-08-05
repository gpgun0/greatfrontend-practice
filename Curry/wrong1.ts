export default function curry(func: Function): Function {
  let args = [];

  function curried(arg) {
    if (arg !== undefined) {
      args.push(arg);
    }

    if (args.length === func.length) {
      return func.call(null, ...args);
    }
    return curried;
  }

  return curried;
}
