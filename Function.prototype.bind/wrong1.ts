interface Function {
  myBind(thisArg: any, ...boundArgs: any[]): Function;
}

Function.prototype.myBind = function (thisArg: any, ...boundArgs: any[]) {
  return function (...args) {
    return this.call(thisArg, ...boundArgs, ...args);
  };
};
