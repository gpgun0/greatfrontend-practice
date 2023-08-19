# Function.prototype.call

The `Function.prototype.call()` method calls the function with a given `this` value and arguments provided individually.

Source: [Function.prototype.call() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call)

## Example

```js
function multiplyAge(multiplier = 1) {
  return this.age * multiplier;
}

const mary = {
  age: 21,
};

const john = {
  age: 42,
};

multiplyAge.myCall(mary); // 21
multiplyAge.myCall(john, 2); // 84
```

[Function.prototype.call](https://github.com/gpgun0/greatfrontend-practice/tree/main/Function.prototype.apply)와 유사한 문제입니다.