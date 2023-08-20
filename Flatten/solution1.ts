type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  const result = [];

  function func(value: Array<ArrayValue>) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] instanceof Array) {
        func(value[i]);
        continue;
      }
      result.push(value[i]);
    }

    return result;
  }

  return func(value);
}
