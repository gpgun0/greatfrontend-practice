# Function Length

함수 파라미터의 개수를 반환하는 functionLength를 구현합니다. 함수가 호출될 때 들어오는 인자의 개수 (arguments.length)가 아니라 함수가 정의될 때 정해지는 파라미터의 개수임을 명심합시다.

구현하려는 함수는 단순히 wrapper이기 때문에 굳이 필요 없습니다. 그러나, 함수의 파라미터 개수를 알 수 있는 것은 유용합니다. 특히 [Curry II](https://www.greatfrontend.com/questions/javascript/curry-ii) 문제에서 유용합니다.

## Examples

```js
function foo() {}
function bar(a) {}
function baz(a, b) {}

functionLength(foo); // 0
functionLength(bar); // 1
functionLength(baz); // 2
```

[Function: length | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)



## Goals

### 함수의 length 프로퍼티를 알 수 있다.

함수 인스턴스의 `length` 데이터 프로퍼티는 함수가 예상하는 매개 변수의 수를 나타냅니다.

length 프로퍼티는 rest 파리미터는 제외하고 오직 첫번째 default 변수 앞에 있는 파라미터들만 포함합니다.

```js
function foo(a, b = 2) {}
foo.length; // 1

function bar(a = 1, b = 2) {}
bar.length; // 0

function baz(...args) {}
baz.length; // 0

console.log(((a, b = 1, c) => {}).length);
// 1, only parameters before the first one with
// a default value are counted
```

이와 다르게, [arguments.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/length)는 실행된 함수에 지역적이며 실제로 함수에 전달된 인자들의 개수를 제공합니다.
