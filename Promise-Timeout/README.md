# Promise Timeout

data를 가져오거나 다른 비동기 동작을 수행할 때, timeout 기간을 세팅하는 것은 때때로 유용합니다. 즉, 응답이 timeout전에 오도록 강제하고 그렇지 않다면 실패한 것으로 여기는 겁니다.

본 문제에선 promise와 timeout기간을 받아 Promise를 반환하는 `promiseTimeout`함수를 구현합니다. 만약 인자로 받은 promise가 timeout 기간 안에 settled된다면, 반환되는 promise는 promise 인자의 sttled된 값과 함께 settled된 상태여야 합니다. 그렇지 않다면 "Promise timeout" 문자열로 reject된 promise를 반환해야 합니다.

## Leet Code

[Problem](https://leetcode.com/problems/promise-time-limit/)

[Solution](https://github.com/gpgun0/leetcode/blob/master/2637-promise-time-limit/2637-promise-time-limit.ts)

## Example

```js
function fakeFetch(latency) {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation that resolves after `latency`.
    setTimeout(() => {
      resolve('Data successfully fetched!');
    }, latency);
  });
}

const response = await promiseTimeout(fakeFetch(1000), 2000);
console.log(response); // Data successfully fetched!

await promiseTimeout(fakeFetch(5000), 2000);
// "Promise timeout" thrown.
```
## Goals

### Promise.race이 무엇인지를 알고 이를 활용할 수 있다.

solution1에선 Promise.race를 사용하여 문제를 풀었습니다. [Promise.race](https://github.com/gpgun0/greatfrontend-practice/tree/main/Promise.race)에 대한 설명을 참고하길 바랍니다.
