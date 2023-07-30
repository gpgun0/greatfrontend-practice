// Here's a solution that is based off the Array.prototype.filter ECMAScript specification.

// 1. Let O be ? ToObject(this value).
// 2. Let len be ? LengthOfArrayLike(O).
// 3. If IsCallable(callbackfn) is false, throw a TypeError exception.
// 4. Let A be ? ArraySpeciesCreate(O, 0).
// 5. Let k be 0.
// 6. Let to be 0.
// 7. Repeat, while k < len,
//     a. Let Pk be ! ToString(𝔽(k)).
//     b. Let kPresent be ? HasProperty(O, Pk).
//     c. If kPresent is true, then
//         i. Let kValue be ? Get(O, Pk).
//         ii. Let selected be ToBoolean(? Call(callbackfn, thisArg, « kValue, 𝔽(k), O »)).
//         iii. If selected is true, then
// 1. Perform ? CreateDataPropertyOrThrow(A, ! ToString(𝔽(to)), kValue).
// 2. Set to to to + 1.
// d. Set k to k + 1.
// 8. Return A.

interface Array<T> {
  myFilter(callbackFn: (value: T) => boolean, thisArg?: any): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  if (
    typeof callbackFn !== "function" ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function.`);
  }

  const len = this.length;
  const A = [];
  let k = 0;
  let to = 0;

  while (k < len) {
    const kPresent = Object.hasOwn(this, k);
    if (kPresent) {
      const kValue = this[k];
      const selected = Boolean(callbackFn.call(thisArg, kValue, k, this));
      if (selected === true) {
        A[to] = kValue;
        to = to + 1;
      }
    }
    k = k + 1;
  }

  return A;
};

interface Array<T> {
  test(callbackFn: (value: T) => boolean, thisArg?: any): Array<T>;
}

const isThisProductEven = function (element) {
  console.log(this);
  return (element * this) % 2 === 0;
};

const isThisProductEvenArrowFn = (element) => {
  console.log(this);
  return (element * this) % 2 === 0;
};

Array.prototype.test = function (callbackFn, thisArg) {
  callbackFn(this);
  isThisProductEvenArrowFn(3);
  return this;
};

// [1, 2, 3].test(isThisProductEven);
[1, 2, 3].test(isThisProductEvenArrowFn);
// isThisProductEven(3);
// isThisProductEvenArrowFn(3);
