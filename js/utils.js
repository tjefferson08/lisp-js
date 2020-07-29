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

export function* interleave(iterable1, iterable2) {
  const iterator1 = iterable1[Symbol.iterator]();
  const iterator2 = iterable2[Symbol.iterator]();
  let current1 = iterator1.next();
  let current2 = iterator2.next();
  while (!current1.done && !current2.done) {
    yield current1.value;
    yield current2.value;
    current1 = iterator1.next();
    current2 = iterator2.next();
  }
}

export const is_symbol = ast =>
  typeof ast === "symbol" && !/^:/.test(Symbol.keyFor(ast));

export const is_keyword = ast =>
  typeof ast === "symbol" && /^:/.test(Symbol.keyFor(ast));

export const is_pair = ast => ast instanceof List && ast.length > 0;

export const Atom = {
  is_atom: item => item.type === "atom",
  build: malData => ({ type: "atom", value: malData }),
  deref: atom => {
    if (!Atom.is_atom(atom)) {
      throw new Error("Cannot deref values other than atoms");
    }
    return atom.value;
  },
  reset: (atom, malData) => {
    if (!Atom.is_atom(atom)) {
      throw new Error("Cannot reset entities other than atoms");
    }
    atom.value = malData;
    return atom.value;
  },
  // TODO: concurrent access?
  swap: (atom, updateFn, ...args) => {
    atom.value = updateFn(atom.value, ...args);
    return atom.value;
  }
};
