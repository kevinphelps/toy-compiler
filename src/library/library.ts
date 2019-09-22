export const library: { [name: string]: string } = {
  log: stringifyFunction(log),
  add: stringifyFunction(add),
};

export function log(value: any) {
  console.log(value);
  return value;
}

export function add(x: number, y: number) {
  return x + y;
}

function stringifyFunction(fn: Function) {
  const instrumentationRegex = /cov_[a-z0-9.$_]+\[[0-9]+\](?:\+\+);/gi;
  return fn.toString().replace(instrumentationRegex, '');
}
