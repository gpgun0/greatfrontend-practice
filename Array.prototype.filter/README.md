# Array.prototype.filter

Array.prototype.filter creates a new array populated with the results of calling a provided function on every element in the calling array.

Implement Array.prototype.filter. To avoid overwriting the actual Array.prototype.filter which is being used by the autograder, we shall instead implement it as Array.prototype.myFilter.

## Examples
```js
[1, 2, 3, 4].myFilter((value) => value % 2 == 0); // [2, 4]
[1, 2, 3, 4].myFilter((value) => value < 3); // [1, 2]
```

## Notes
The filter callback function takes in more than just the element! There's also a second parameter for Array.prototype.filter as well. You are recommended to read the specification for Array.prototype.filter on MDN Docs before attempting.

## Goals

### 1. 콜백 함수 호출시 상황에 따라 달라지는 this 바인딩을 알 수 있다.

함수 내부에 this가 포함된 두 함수가 있습니다.  
(아래 예시에선 node.js 환경에서 index.js 파일을 실행시켰습니다.)

```js
console.log(this) // console: {} (브라우저 환경일 땐, window 객체)

// function
const isThisProductEven = function (element) {
  console.log(this); 
  return (element * this) % 2 === 0;
};

// arrow function
const isThisProductEvenArrowFn = (element) => {
  console.log(this);
  return (element * this) % 2 === 0;
}
```

myFilter 메서드의 callbackFn 으로 각각 두 함수를 전달해보겠습니다.

```ts
Array.prototype.myFilter = function (callbackFn, thisArg) {
  const arr = this;
  callbackFn(arr[0]);
  // ...
};

[1, 2, 3].myFilter(isThisProductEven); // console: window or globalThis object
[1, 2, 3].myFilter(isThisProductEvenArrowFn); // console: {}
```

콜백함수로 일반 함수를 호출 할 땐, 일반 함수의 특성을 따라 this에 전역 객체가 바인딩됩니다.  
콜백함수로 화살표 함수를 호출할 땐, 화살표 함수의 특성을 따라 화살표 함수가 선언된 콜스택의 this가 바인딩됩니다.  

> 주의! 화살표 함수가 호출된 콜스택의 this가 바인딩 되는 것이 아니라 화살표 함수가 **선언된 콜스택**의 this가 바인딩 되는 것을 명심해야 합니다.

콜백함수로 어떤 유형의 함수가 전달되었든 원하는 this를 넣어주고 싶을 땐, call, apply 또는 bind 메서드를 사용하면 됩니다.

```ts
Array.prototype.myFilter = function (callbackFn, thisArg) {
  const arr = this;
  callbackFn.call(this, arr[0]);
  // ...
};

[1, 2, 3].myFilter(isThisProductEven); // console: [1, 2, 3]
[1, 2, 3].myFilter(isThisProductEvenArrowFn); // console: [1, 2, 3]
```

요약하자면 다음과 같습니다.

- 콜백함수로 일반 함수를 호출시
=> 전역 객체를 가리킨다.
- 콜백함수로 화살표 함수를 호출시
=> 화살표 함수가 선언된 콜스택의 this를 가리킨다.
- 콜백함수에 call, apply 또는 bind 메서드를 사용하여 호출시
=> call, apply 또는 bind 메서드의 첫번째 인자로 전달해준 this를 가리킨다.

### 2. JavaScript 희소 배열에 대해 알 수 있다.

자바스크립트의 배열은 요소를 위한 각각의 메모리 공간이 동일한 크기를 갖지 않아도 되며, 연속적으로 이어져 있지 않을 수도 있습니다. 이처럼 자바스크립트의 배열은 엄밀히 말해 일반적 의미의 배열이 아니며, 배열의 동작을 흉내 낸 특수한 객체입니다.

- 일반적인 배열
  - 배열 구현
  - 인덱스 조회 성능 높음
  - 특정 요소 검색, 삽입, 삭제 비교적 느림
- 자바스크립트 배열
  - 객체 구현
  - 인덱스 조회 성능 비교적 낮음
  - 특정 요소 검색, 삽입, 삭제 빠름

왜 자바스크립트 배열은 객체로 구현되어 있을까요? 자바스크립트는 프로토타입 기반의 객체지향 프로그래밍 언어이며 배열 역시 객체의 특성을 상속받았기 때문입니다.


```js
const arr = [];
const arrPrototype = arr.__proto__;
console.log(arrPrototype.__proto__);
// {
//   constructor: ƒ Object()
//   ...
// }
```

> 객체로 구현되었다 보니 인덱스로 배열 요소에 순차적으로 접근할 때 구조적으로 느릴 수밖에 없는 단점이 있습니다. 이를 보완하기 위해 대부분의 모던 자바스크립트 엔진은 일반 객체와 구별하여 좀 더 배열처럼 동작하도록 최적화하여 구현했습니다.

자바스크립트 배열은 객체의 특성을 상속받았기 때문에 발생하는 현상이 있습니다.

```js
const obj = {};
console.log(obj.a) // undefined

const arr = [1, 2, 3, 4, 5];
console.log(arr[10]) // undefined
```

자바스크립트 객체에 존재하지 않는 프로퍼티에 접근하면 undefined를 반환합니다. ReferenceError나 Out of Range 에러가 발생하지 않습니다.

또한, 객체의 특성을 상속받았기 때문에 구조적으로 인덱스가 연속적으로 이어져 있지 않을 수 있습니다. 따라서 자바스크립트 배열은 희소배열일 수 있습니다. 

무슨 말이냐면 자바스크립트는 아래와 같은 배열을 허용합니다.
```js
const arr = [1, , 3, , 5];
Object.getOwnPropertyDescriptors(arr);
// {
//   0: {value: 1, writable: true, enumerable: true, configurable: true},
//   2: {value: 3, writable: true, enumerable: true, configurable: true},
//   4: {value: 5, writable: true, enumerable: true, configurable: true},
//   'length': {value: 5, writable: true, enumerable: false, configurable: false}
// }
```

arr가 1 또는 3 인덱스를 ownProperty로 가질 것 같지만 그렇지 않다는 점에 주의합시다. 배열은 객체의 특성을 상속받고 요소들이 연속적으로 있지 않아도 되기 때문에 발생하는 현상입니다. 

따라서 본 문제에선 `Object.hasOwn` 을 사용하여 희소 배열을 예외처리 하였습니다.
 
```js
const arr = [1, , 3, , 5];
Object.hasOwn(arr, 1) // false
```

### Object.hasOwn(arr, key), arr.hasOwnProperty(key)와 in 연산자의 차이를 알 수 있습니다. 

#### arr.hasOwnProperty(key)

ES5 문법 Object.create(null)로 생성된 객체에 사용 불가능 합니다.

```js
const obj = Object.create(null);
obj.a = 1;
obj.hasOwnProperty('a') // Uncaught TypeError: obj.hasOwnProperty is not a function
```

ES2022 문법 Object.hasOwn을 사용하면 가능합니다.

```js
const obj = Object.create(null);
obj.a = 1;
Object.hasOwn(obj, 'a') // true
```

in 연산자는 프로토타입 체이닝된 상위 객체의 프로퍼티까지 검사합니다.

```js
const arr = [1, 2, 3];
'hasOwnProperty' in arr // true
```

Object.hasOwn는 그렇지 않습니다.

```js
const arr = [1, 2, 3];
Object.hasOwn(arr, 'hasOwnProperty') // false
```

| | Object.hasOwn(obj, key) | obj.hasOwnProperty(key) | key in obj |
| --- | --- | --- | --- |
| Object.create(null) | 사용 가능 | 사용 불가능 | 사용 가능 |
| 상위 프로토타입 체인 객체의 프로퍼티 검사 | X | X | O |
