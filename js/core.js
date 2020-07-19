import { Atom, List, Vector } from "./utils.js";
import { pr_str } from "./printer.js";
import { read_str } from "./reader.js";

const vec_or_list = coll => coll instanceof List || coll instanceof Vector;

// TODO: variadic equal
const equal = (a, b) => {
  if (vec_or_list(a)) {
    // TODO: clojure says vec/map with same elements are =
    if (!vec_or_list(b)) {
      return false;
    }
    if (a.length === 0 && b.length === 0) {
      return true;
    }

    return equal(a[0], b[0]) && equal(a.slice(1), b.slice(1));
  }

  return a === b;
};

const lt = (a, b) => a < b;
const lte = (a, b) => a <= b;
const gt = (a, b) => a > b;
const gte = (a, b) => a >= b;

// (pr-str 1 2 3) => "1 2 3"
const prStr = (...args) => args.map(x => pr_str(x, true)).join(" ");

// (str 1 2 3) => "123"
const str = (...args) => args.reduce((acc, x) => acc + pr_str(x, false), "");

export const ns = new Map([
  ["+", (...args) => args.reduce((sum, n) => sum + n)],
  ["-", (...args) => args.reduce((difference, n) => difference - n)],
  ["*", (...args) => args.reduce((prod, n) => prod * n)],
  ["/", (...args) => args.reduce((div, n) => div / n)],
  ["prn", (...args) => console.log(prStr(...args)) || null],
  ["pr-str", prStr],
  ["println", (...args) => console.log(str(...args)) || null],
  ["str", str],
  ["list", (...args) => List.of(...args)],
  ["list?", coll => coll instanceof List],
  ["empty?", list => list.length === 0],
  ["count", list => (list === null ? 0 : list.length)],
  ["=", equal],
  ["<", lt],
  ["<=", lte],
  [">", gt],
  [">=", gte],
  ["read-string", read_str],
  ["slurp", filename => fs.readFileSync(filename, { encoding: "utf8" })],
  ["atom", Atom.build],
  ["atom?", Atom.is_atom],
  ["deref", Atom.deref],
  ["reset!", Atom.reset],
  ["swap!", Atom.swap]
].map(([sym, fn]) => [Symbol.for(sym), fn]))
