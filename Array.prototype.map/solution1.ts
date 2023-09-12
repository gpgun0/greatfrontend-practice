interface Array<T> {
  myMap<U>(callbackFn: (value: T) => U, thisArg?: any): Array<U>;
}

Array.prototype.myMap = function (callbackFn, thisArg) {
  const result = Array();
  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) {
      result.push(undefined);
      continue;
    }

    const elem = callbackFn.call(thisArg, arr[i], i, arr);
    result.push(elem);
  }

  return result;
};
