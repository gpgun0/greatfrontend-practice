# Curry

커링은 여러개의 인자를 받는 함수를 각각 하나의 인자를 받는 일련의 함수로 변환하는 테크닉입니다.

curry 함수를 구현하는데
- curry는 하나의 함수를 인자로 받고
- 하나의 인자를 받는 함수를 반환하며
- 이 반환된 함수는 기존 함수가 받아야 하는 최소의 인자 개수를 받을 때까지 반복적으로 호출되어야 합니다.
- 마지막으론 처음에 curry에게 인자로 준 함수가 제공된 인자들을 가지고 실행되야 합니다.

## Leet Code

[Problem - Premium](https://leetcode.com/problems/curry)

[Solution](https://github.com/gpgun0/leetcode/blob/master/2740-curry/2740-curry.js)

## Prerequisite

- [Function Length](https://www.greatfrontend.com/questions/javascript/function-length)
- arguments
- this 바인딩

## Examples

```js
function add(a, b) {
  return a + b;
}

const curriedAdd = curry(add);
curriedAdd(3)(4); // 7

const alreadyAddedThree = curriedAdd(3);
alreadyAddedThree(4); // 7
```

```js
function multiplyThreeNumbers(a, b, c) {
  return a * b * c;
}

const curriedMultiplyThreeNumbers = curry(multiplyThreeNumbers);
curriedMultiplyThreeNumbers(4)(5)(6); // 120

const containsFour = curriedMultiplyThreeNumbers(4);
const containsFourMulFive = containsFour(5);
containsFourMulFive(6); // 120
```

## Resources

[Understanding JavaScript currying](https://blog.logrocket.com/understanding-javascript-currying)
[Lodash curry](https://lodash.com/docs/4.17.15#curry)

## Goals

아래 용어를 이해할 필요가 있습니다.

- **Arity**: 함수에서 취한 인수 또는 피연산자의 개수.
- **Closure**: 함수와 그것이 참조하는 lexical environment의 조합.

curried 함수는 들어온 인자의 개수가 기존 함수의 arity개수와 같아진 후에 멈추게 됩니다.

클로저를 통해 지금까지 받은 curried 함수의 인수를 기록할 수 있습니다. curried 함수가 호출될 때마다 지금까지 받은 인수의 개수와 기존 함수의 airty 개수를 비교합니다.

만약 같다면 기존 함수에 지금까지 받은 인자들을 넘겨 호출합니다.
만약 인자가 더 필요하다면 인자를 더 받을 수 있는 curried 함수를 반환해야 합니다.
