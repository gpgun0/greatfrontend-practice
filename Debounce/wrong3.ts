export default function debounce(func: Function, wait: number = 0): Function {
  let timeId = null;

  return (...args) => {
    clearTimeout(timeId);

    timeId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
