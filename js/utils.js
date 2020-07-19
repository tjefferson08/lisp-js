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
