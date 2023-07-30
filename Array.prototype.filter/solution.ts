interface Array<T> {
  myFilter(callbackFn: (value: T) => boolean, thisArg?: any): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  const len = this.length;
  const result = [];

  for (let k = 0; k < len; k++) {
    if (Object.hasOwn(this, k) && callbackFn.call(thisArg, this[k], k, this)) {
      result.push(this[k]);
    }
  }

  return result;
};
