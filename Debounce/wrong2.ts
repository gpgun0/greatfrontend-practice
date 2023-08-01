export default function debounce(func: Function, wait: number = 0): Function {
  let timeId = null;

  return function (...args) {
    clearTimeout(timeId);

    timeId = setTimeout(function () {
      func.apply(this, args);
    }, wait);
  };
}
