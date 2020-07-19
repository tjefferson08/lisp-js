export class Vector extends Array {}
export class List extends Array {}

export function* in_pairs(iterable) {
  const iterator = iterable[Symbol.iterator]();
  let current = iterator.next();
  let next = iterator.next();
  while (!next.done) {
    yield [current.value, next.value];
    current = iterator.next();
    next = iterator.next();
  }
}

export const is_symbol = ast =>
  typeof ast === "symbol" && !/^:/.test(Symbol.keyFor(ast));

export const is_keyword = ast =>
  typeof ast === "symbol" && /^:/.test(Symbol.keyFor(ast));
