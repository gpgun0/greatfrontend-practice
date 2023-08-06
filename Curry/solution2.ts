export default function curry(func: Function): Function {
  return function curried(...args) {
    if (args.length === func.length) {
      return func.call(this, ...args);
    }
    return curried.bind(this, ...args);
  };
}
