# Promise.reject

> "The Promise.reject() static method returns a Promise object that is rejected with a given reason."

Source: [Promise.reject() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

Unlike Promise.resolve(), Promise.reject() always wraps reason in a new Promise object, even when reason is already a Promise.

Implement the Promise.reject() function as promiseReject. You can ignore the case where this is referenced within the implemented function.

## Background

### Promise의 이점

#### 콜백 함수의 단점

1. 콜백 함수를 사용한다면 비동기 함수 내부의 비동기 코드 처리 결과를 비동기 함수 외부로 반환할 수 없습니다.
또한, 처리 결과를 상위 스코프의 변수에 할당한다면 기대한 대로 동작하지 않습니다.

```js
let num = 0;

const asyncFn = (num, callback) => {
  setTimeout(() => {
    callback(num)
  }, 1000);
}

const changeNum = (n) => {
  num = n
}

asyncFn(10, changeNum);
console.log(num); // 0
```


2. 에러 처리가 어렵습니다.

`asyncFn`을 실행하면 1초 뒤에 'Error Catched' 메세지가 콘솔에 찍힐 것으로 예상되지만 실제로는 그렇지 않습니다.

```javascript
const asyncFn = () => {
  try {
    setTimeout(function errorFn() {
      throw new Error('Error!');
    }, 1000);
  } catch (err) {
    console.error('Error Catched', err); // 콘솔에 나타나지 않음
  }
};

asyncFn();
```

그 이유는 에러는 항상 **호출자** 방향으로 전파되기 때문입니다. 

정상적으로 Error를 잡아내는 코드의 콜 스택 상태를 그림으로 보여드리겠습니다.

```javascript
const fn = () => {
  try {
    (function errorFn() {
      throw new Error('Error!');
    })();
  } catch (err) {
    console.error('Error catched', err);
  }
};

fn();
```

![](/Promise.reject/error_call_stack.png)

`errorFn`을 호출한 fn에게 에러가 전파돼서 catch문이 이 에러를 정상적으로 잡아낼 수 있습니다.

다시 비동기 코드로 돌아와 똑같이 그림으로 콜 스택 상태를 나타내보겠습니다.
```javascript
const asyncFn = () => {
  try {
    setTimeout(function errorFn() {
      throw new Error('Error!');
    }, 1000);
  } catch (err) {
    console.error('Error Catched', err); // 콘솔에 나타나지 않음
  }
};

asyncFn();
```

![](/Promise.reject/error_call_stack2.png)

에러를 던졌지만 asyncFn으로 전파되지 않아 catch 블록에서 에러가 잡히지 않습니다.  

프로미스를 사용한다면 이 문제들을 해결할 수 있습니다.

첫째로 비동기 함수 내부의 비동기 처리 결과를 비동기 함수 외부로 반환할 수 있습니다. 반환된 값은 Promise 입니다.

```js
let num = 0;

const asyncFn = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(num)
      }, 1000);
  })
};

const changeNum = (n) => {
  num = n
}

const result = asyncFn(10);

setTimeout(() => console.log(result), 1100);
// Promise {<fulfilled>}
// [[Prototype]]: Promise
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: 10
```

반환된 값이 Promise기 때문에 then 메서드를 사용하여 후속처리할 수 있습니다.

```js
result.then(changeNum);
```

두번째로 에러 처리 문제를 해결할 수 있습니다.  
콜백함수가 던진 에러를 try catch문에서 잡아내지 못했지만, 프로미스의 `reject`를 사용한다면 함수 외부로 에러를 래핑한 Promise를 반환할 수 있습니다.  
이를 catch 후속 처리 함수를 사용하여 적절한 처리를 할 수 있습니다.

```js
const asyncFn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Error!'));
    }, 1000);
  });
};

asyncFn().catch((err) => console.error('Error Catched', err));
// Error Catched Error: Error!
```

## Goals

### Promise의 static 메서드인 Promise.reject에 대해 알 수 있다.

`Promise.resolve`와 `Promise.rejec` 메서드는 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용합니다.  

`Promise.reject` 메서드는 인수로 전달받은 값을 reject하는 프로미스를 생성합니다. 

```js
const rejectedPromise = Promise.reject(new Error('Error!'));
rejectedPromise.catch(console.log);
```

위 코드는 다음과 동일합니다. (이 문제의 정답과 유사합니다.)

```js
const rejectedPromise = new Promise((_, reject) => reject(new Error('Error!'))); 
rejectedPromise.catch(console.log);
```



#### Promise.resolve와의 차이점

만약 기존 Promise를 Promise.resolve로 감싼다면, 기존 Promise를 새로운 Promise로 감싸는 것이 아니라 기존 Promise와 똑같은 Promise를 반환할 뿐입니다.

```js
const original = Promise.resolve(33);
const cast = Promise.resolve(original);
cast.then((value) => {
  console.log(`value: ${value}`);
});
console.log(`original === cast ? ${original === cast}`);

// original === cast ? true
// value: 33
```

그러나 Promise.reject로 기존 Promise를 감싼다면, 새로운 Promise 인스턴스를 반환합니다.

```js
const p = Promise.resolve(1);
const rejected = Promise.reject(p);
console.log(rejected === p); // false
rejected.catch((v) => {
  console.log(v === p); // true
});
```

```js
const p = Promise.resolve(1);
const rejected = Promise.reject(p);
console.log(rejected === p); // false
rejected.catch((v) => v).then(console.log); // 1
```