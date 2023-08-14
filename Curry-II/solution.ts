export default function curry(func: Function): Function {
  return function curried(...args) {
    if (arguments.length >= func.length) {
      return func.apply(this, args);
    }
    return curried.bind(this, ...args);
  };
}
