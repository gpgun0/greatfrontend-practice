interface Function {
  myBind(thisArg: any, ...boundArgs: any[]): Function;
}

Function.prototype.myBind = function (thisArg: any, ...boundArgs: any[]) {
  const sym = Symbol();
  const wrapperObj = Object(thisArg);
  Object.defineProperty(wrapperObj, sym, {
    enumerable: false,
    value: this,
  });

  return function (...args) {
    return wrapperObj[sym](...boundArgs, ...args);
  };
};
