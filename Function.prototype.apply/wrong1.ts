interface Function {
  myApply(thisArg: any, args: any[]): any;
}

Function.prototype.myApply = function (thisArg, args) {
  return this.call(thisArg, ...args);
};

// args가 null 또는 undefined인 경우를 처리하지 못합니다.
