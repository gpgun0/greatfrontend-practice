interface Function {
  myBind(thisArg: any, ...boundArgs: any[]): Function;
}

Function.prototype.myBind = function (thisArg: any, ...boundArgs: any[]) {
  const func = this;

  return function (...args) {
    return func.call(thisArg, ...boundArgs, ...args);
  };
};
