export default function functionLength(fn: Function): number {
  return fn.arguments;
}

// TypeError: 'caller', 'callee', and 'arguments' properties
// may not be accessed on strict mode functions or the arguments objects for calls to them
