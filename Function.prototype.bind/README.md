# Function.prototype.bind

The `Function.prototype.bind()` method creates a new function that, when called, has its `this` keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

Source: [Function.prototype.bind() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)

`bind`없이 `Function.prototype.bind()`를 구현합니다.

## Example

```js
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};

const unboundGetAge = john.getAge;
console.log(unboundGetAge()); // undefined

const boundGetAge = john.getAge.myBind(john);
console.log(boundGetAge()); // 42
```

## Goals

### wrong1가 틀린 이유를 설명할 수 있다.

myBind를 메서드로 호출하면 메서드 내부의 this는 자신을 호출한 객체를 가리킵니다.

```ts
function foo() {};

Function.prototype.myBind = function() {
    console.log(this);
}

foo.myBind();
// Console
// ƒ foo() {}
```

따라서 메서드 `function() {}` 안의 `this`로 호출하고자 하는 함수를 참조할 수 있습니다.

그러나 아래처럼 작성하면 문제가 됩니다.

```ts
Function.prototype.myBind = function (thisArg: any, ...boundArgs: any[]) {
  // (1)
  return function (...args) {
    // (2)
    return this.call(thisArg, ...boundArgs, ...args);
  };
};
```

메서드 내부에 `this`가 있지만, 실질적으로 반환하는 함수 안에 존재합니다. regular 함수 안에서 this는 무조건 전역 객체를 가리키므로 오답이 됩니다.

**(1)**: this가 메서드를 호출한 함수를 가리킵니다.  
**(2)**: this가 전역 객체를 가리킵니다.

### solution1의 잠재적 위험 요소를 설명할 수 있다.

이것은 대부분 괜찮지만 드문 경우에는 신뢰성 위험을 초래합니다. 자바스크립트의 property resolution 메커니즘 작동 방식 때문에 `originalFunc`가 사용자 정의 `call` 메서드 또는 프로퍼티를 가질 수 있습니다. 이는 `Function.prototype.call`을 덮어버립니다. 따라서 `originalFunc.call`은 빌트인 `call` 메서드가 아닌 사용자 정의 `call`을 호출합니다.


```js
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};

// This is not the built-in call method.
john.getAge.call = function () {
  return 3;
};

Function.prototype.myBind = function (thisArg, ...boundArgs) {
  return function (...args) {
    // invoke user-defined call.
    return originalFunc.call(thisArg, [...boundArgs, ...args]);
  };
};

const boundGetAge = john.getAge.myBind(john);

console.log(boundGetAge());
// 3
```

### solution2 - solution1의 문제를 해결하고 `Reflect`에 대해 알 수 있다.

`call`과 더불어 `apply`도 사용자 정의 메서드가 덮어버린 경우를 가정해보겠습니다. 이 상황을 대처할 수 있는 방법입니다.

#### apply 사용

```ts
originalFunc.call(thisArg, ...boundArgs, ...args);
```

대신

```ts
Function.prototype.apply.call(originalFunc, thisArg, [...boundArgs, ...args]);
```
을 사용할 수 있습니다.

실행되는 과정을 단계적으로 설명하겠습니다.

**1.**

```ts
const foo = Function.prototype.apply;
foo.call(originalFunc, thisArg, [...boundArgs, ...args]);
```

`foo`함수를 실행하는데 `this`엔 `originalFunc`을 바인딩하고 인자로는 `thisArg, [...boundArgs, ...args]`를 넘겨줍니다.

**2.**

이제 `foo`의 `this`가 `originalFunc`가 된 상태입니다. 그런데 여기서 `foo`는 `Function.prototype.apply` 입니다. `Function.prototype.apply`의 `this`가 `originalFunc`이므로 결과는 아래 코드와 동일합니다.

```ts
// Function.prototype.apply(thisArg, [...boundArgs, ...args]); with `this -> originalFunc`
originalFunc.apply(thisArg, [...boundArgs, ...args]);
```

#### Reflect

가독성을 높이기 위해 `Reflect`를 사용할 수 있습니다. 다소 덜 알려진 `Reflect` API는 지정된 인수를 가진 target 함수를 호출하기 위해 ES6의 자바스크립트에 추가되었습니다.

위 코드를 아래처럼 작성할 수 있습니다.

```ts
// Function.prototype.apply.call(originalFunc, thisArg, [...boundArgs, ...args]);

Reflect.apply(originalFunc, thisArg, [...boundArgs, ...args]);
```

### solution3의 과정을 그림으로 설명할 수 있다.

[Function.prototype.apply](https://github.com/gpgun0/greatfrontend-practice/tree/main/Function.prototype.apply) 문제 설명으로 대체합니다.

