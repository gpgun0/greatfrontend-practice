export default function curry(func: Function): Function {
  let args = [];

  return function curryFunction(arg) {
    if (arg !== undefined) {
      args.push(arg);
    }

    if (args.length === func.length) {
      const inputs = args;
      args = [];
      return func.call(this, ...inputs);
    }
    return curryFunction;
  };
}
