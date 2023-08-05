export default function curry(func: Function): Function {
  let args = [];

  function curried(arg) {
    if (arg !== undefined) {
      args.push(arg);
    }

    if (args.length === func.length) {
      const inputs = args;
      args = []; // 재참조
      return func.call(null, ...inputs);
    }
    return curried;
  }

  return curried;
}
