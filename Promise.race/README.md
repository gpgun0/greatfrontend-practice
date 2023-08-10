# Promise.race

`Promise.race()` 메서드는 iterable의 promise들 중 가장 빠르게 fulfill또는 reject된 promise를 값 또는 이유와 함게 반환합니다.

만약 iterable이 비어있다면 영원히 pending상태인 promise를 반환해야 합니다.

만약 iterable이 한개 이상의 non-promise 또는 이미 settled된 promise를 가진다면, `Promise.race()`는 그들 중 가장 첫번째 값을 resolve합니다.

Source: [Promise.race() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

본 문제에선 iterable 대신 배열을 파라미터로 받습니다.

## Examples

```js
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 100);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 400);
});

await promiseRace([p0, p1]); // 42
```

```js
const p0 = Promise.resolve(42);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(21);
  }, 100);
});

await promiseRace([p0, p1]); // 42
```

```js
const p0 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 400);
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('Err!');
  }, 100);
});

try {
  await promiseRace([p0, p1]);
} catch (err) {
  console.log(err); // 'Err!'
}
```

## Goals

### Promise.race 정적 메서드를 알 수 있다.

`Promise.race()` 정적 메서드는 promise iterable을 받아 가장 먼저 settles된 promise의 최종 상태를 가진 promise를 반환합니다.

Promise.race() 메서드는 [Promise 동시성 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency) 중 하나입니다. 첫 번째 비동기 작업을 완료하고 싶지만 최종 상태(즉, 성공하거나 실패할 수 있음)에 신경 쓰지 않는 경우에 유용합니다. 

#### 예시

##### 1. Using Promise.race() to implement request timeout
`setTimeout`을 활용해서 전달한 promise가 주어진 시간안에 resolve되지 않으면 reject하게 만들 수 있습니다. 

```js
const data = Promise.race([
  fetch("/api"),
  new Promise((resolve, reject) => {
    // Reject after 5 seconds
    setTimeout(() => reject(new Error("Request timed out")), 5000);
  }),
])
  .then((res) => res.json())
  .catch((err) => displayError(err));
```

##### 2. Using Promise.race() to detect the status of a promise

`Promise.race()`의 특성을 사용해서 promise의 status를 알 수 있습니다.

promise가 아직 pending 상태라면 then 구문에서 `pendingState`가 반환됩니다. 그렇지 않다면 인자로 넣어준 promise가 fulfilled 상태를 가진채 반환됩니다.

```js
function promiseState(promise) {
  const pendingState = { status: "pending" };

  return Promise.race([promise, pendingState]).then(
    (value) =>
      value === pendingState ? value : { status: "fulfilled", value },
    (reason) => ({ status: "rejected", reason }),
  );
}
```

아래 예시를 보면 결과가 단순히 value를 반환하는게 아니라 그것의 상태 (pending, fulfilled)까지 반환하는 것을 확인할 수 있습니다.

```js
const p1 = new Promise((res) => setTimeout(() => res(100), 100));
const p2 = new Promise((res) => setTimeout(() => res(200), 200));
const p3 = new Promise((res, rej) => setTimeout(() => rej(300), 100));

async function getStates() {
  console.log(await promiseState(p1));
  console.log(await promiseState(p2));
  console.log(await promiseState(p3));
}

console.log("Immediately after initiation:");
getStates();
// Logs:
// Immediately after initiation:
// { status: 'pending' }
// { status: 'pending' }
// { status: 'pending' }

setTimeout(() => {
  console.log("After waiting for 100ms:");
  getStates();
}, 100);

// Logs:
// After waiting for 100ms:
// { status: 'fulfilled', value: 100 }
// { status: 'pending' }
// { status: 'rejected', reason: 300 }
```

##### 3. Comparison with Promise.any()

`Promise.race`는 첫번째로 <u>**settled**</u>된 promise를 반환합니다.

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, "two");
});

Promise.race([promise1, promise2])
  .then((value) => {
    console.log("succeeded with value:", value);
  })
  .catch((reason) => {
    // Only promise1 is fulfilled, but promise2 is faster
    console.error("failed with reason:", reason);
  });
// failed with reason: two
```

하지만, `Promise.any`는 첫번째로 <u>**fulfilled된**</u> promise를 반환합니다.

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, "two");
});

Promise.any([promise1, promise2])
  .then((value) => {
    // Only promise1 is fulfilled, even though promise2 settled sooner
    console.log("succeeded with value:", value);
  })
  .catch((reason) => {
    console.error("failed with reason:", reason);
  });
// succeeded with value: one
```

### wrong3 - `then(f, f)`과 `then(f).catch(f)`의 미묘한 차이를 알 수 있다.

#### 실행 순서

차이를 단적으로 보여주는 예제가 있습니다.

```js
Promise.reject(10).then(console.log).catch(console.log);
Promise.reject(20).then(console.log, console.log);

// Logs
// 20
// 10
```

log를 찍어보면 10, 20 순서로 나올 것 같지만 그렇지 않습니다. 아래 함수는 곧바로 reject된 `20` value를 처리하지만, 위 함수는 그렇지 않습니다. `then`을 실행하고 난 뒤 `catch`를 실행하기 때문에 시간차이가 발생하게 됩니다.

따라서 wrong3와 같이 코드를 작성한다면 다음과 같은 테스트를 통과하지 못합니다. 
p1은 then구문에서 바로 resolve되지만, p0은 then을 지나 catch를 실행해야 reject되기 때문이죠.
```js
test('instant reject instant resolve', async () => {
    expect.assertions(1);
    const p0 = Promise.reject(42);
    const p1 = Promise.resolve(2);
    
    await expect(promiseRace([p0, p1])).rejects.toBe(42);
});
```

그런데 Promise.reject를 `then`메서드로 후속처리하면 어떤 과정이 일어날까요?

설명을 위해 편의상 위 함수는 아래와 같이 표현하겠습니다.

```js
Promise.reject(10).then(console.log).catch(console.log);
Promise.reject(10).then(console.log, null).catch(console.log);
```

MDN에 따르면 onRejected 인자에 함수가 오지 않으면 내부적으로 then 메서드가 받은 rejection reason을 던져주는 thrower 함수로 변환해준다고 합니다.

> MDN: If it is not a function, it is internally replaced with a thrower function ((x) => { throw x; }) which throws the rejection reason it received.

즉, 다음과 같이 변환됩니다.

```js
Promise.reject(10)
  .then(console.log)
  .catch(console.log);

Promise.reject(333)
  .then(console.log, (x) => {
    throw x;
  })
  .catch(console.log);
```


#### 번외. then(f, f)와 then(f).catch(f)의 또 다른 차이점과 용도

```js
function unexpectableError(value) {
  console.log('Resolved: ', value);

  return Promise.reject('Unexpected Error!');
}

function error(err) {
  console.log('Error: ', err);
}
```

value를 resolve하지만, 알 수 없는 문제로 예기치 못한 에러를 반환하는 함수 `unexpectableError`가 있습니다. 이 에러를 각각 `then(f, f)`와 `then(f).catch(f)` 구문으로 잡아보겠습니다.

```js
Promise.resolve('Zzz!')
 .then(unexpectableError, error);
// Resolved: Zzz!

Promise.resolve('Zzz!')
 .then(unexpectableError)
 .catch(error);
// Resolved: Zzz!

// 'Error: Unexpected Error!'
```

`then(f, f)`는 예기치 못한 에러를 잡아내지 못합니다.  

이 차이점을 api 호출에 적용해보면 좋을 것 같습니다.

```jsx
axios.get('/api/example')
    .then(
        (value) => {
            console.log("성공", value);
        },
        (err) => {
            console.err("Error", error.response.status);
        }
    )
    .catch(
        (err) => {
            console.error("Unexpected Error");
        }
    )
```

- then의 두번째 `onRejected` 인자로는 예측할 수 있는 에러를 처리할 수 있는 구문을 넣어줍니다.
- 하지만, `unexpectableError`처럼 then의 `onFulfilled` 에서 알 수 없는 에러가 발생한 경우를 대비하여 catch 구문으로 에러를 처리해줄 수 있습니다.