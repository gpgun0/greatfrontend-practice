export default function debounce(func: Function, wait: number = 0): Function {
  return function (...args) {
    let timeId = null;

    clearTimeout(timeId);

    timeId = setTimeout(() => {
      timeId = null;
      func.apply(this, args);
    }, wait);
  };
}
