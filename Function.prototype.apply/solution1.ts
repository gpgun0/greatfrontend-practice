interface Function {
  myApply(thisArg: any, args: any[]): any;
}

Function.prototype.myApply = function (thisArg, args = []) {
  return this.call(thisArg, ...args);
};
