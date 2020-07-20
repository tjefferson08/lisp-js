import { List, Vector } from "./utils.js";
import { create as createEnv } from "./env.js";

const { assert, assertEqual, test } = window;

const assertSymbolNotFound = (env, sym) => {
  try {
    env.get(sym);
  } catch (err) {
    assert(/not found/.test(err.message));
    assert(err.message.includes(Symbol.keyFor(sym)));
  }
};

test("should be able to create an env and read/write symbols", () => {
  const abc = Symbol.for("abc");
  const def = Symbol.for("def");
  const ghi = Symbol.for("ghi");
  const env = createEnv()
    .set(abc, 123)
    .set(def, List.of(1, 2, 3))
    .set(ghi, Vector.of(3, 2, 1));

  assertEqual(env.get(abc), 123);
  assertEqual(env.get(def), List.of(1, 2, 3));
  assertEqual(env.get(ghi), Vector.of(3, 2, 1));
});

test("recursively looks up variable in outer scope", () => {
  const a = Symbol.for("a");
  const b = Symbol.for("b");
  const c = Symbol.for("c");
  const d = Symbol.for("d");
  const e = Symbol.for("e");
  const f = Symbol.for("f");

  const outermost = createEnv()
    .set(a, 123)
    .set(b, List.of(1, 2, 3));

  const middle = createEnv({ outer: outermost })
    .set(c, Vector.of(3, 2, 1))
    .set(d, true);

  const innermost = createEnv({ outer: middle })
    .set(e, null)
    .set(f, -10);

  assertEqual(innermost.get(a), 123);
  assertEqual(innermost.get(b), List.of(1, 2, 3));
  assertEqual(innermost.get(c), Vector.of(3, 2, 1));
  assertEqual(innermost.get(d), true);
  assertEqual(innermost.get(e), null);
  assertEqual(innermost.get(f), -10);

  assertEqual(middle.get(c), Vector.of(3, 2, 1));
  assertEqual(middle.get(d), true);
  assertEqual(middle.get(a), 123);
  assertEqual(middle.get(b), List.of(1, 2, 3));
  assertSymbolNotFound(middle, e);
  assertSymbolNotFound(middle, f);

  assertEqual(outermost.get(a), 123);
  assertEqual(outermost.get(b), List.of(1, 2, 3));
  assertSymbolNotFound(outermost, c);
  assertSymbolNotFound(outermost, d);
  assertSymbolNotFound(outermost, e);
  assertSymbolNotFound(outermost, f);
});

test("can directly update global/outermost env (for def! statements)", () => {
  const a = Symbol.for("a");
  const b = Symbol.for("b");
  const c = Symbol.for("c");
  const d = Symbol.for("d");

  const parentEnv = createEnv();
  let childEnv1 = createEnv({ outer: parentEnv })
    .set(a, 123)
    .setGlobal(b, 321);

  assertEqual(childEnv1.get(a), 123);
  assertEqual(childEnv1.get(b), 321);
  assertEqual(parentEnv.get(b), 321);

  let childEnv2 = createEnv({ outer: parentEnv });
  assertEqual(childEnv2.get(b), 321);

  childEnv2 = childEnv2.set(c, 456).setGlobal(d, 654);
  assertEqual(childEnv2.get(c), 456);
  assertEqual(childEnv2.get(d), 654);
  assertEqual(parentEnv.get(d), 654);
});

test("can shadow values from parent scopes", () => {
  const a = Symbol.for("a");
  const b = Symbol.for("b");

  const parentEnv = createEnv().set(a, 123);
  assertEqual(parentEnv.get(a), 123);

  const childEnv = createEnv({ outer: parentEnv })
    .set(a, 456)
    .set(b, 100);

  assertEqual(parentEnv.get(a), 123);
  assertEqual(childEnv.get(a), 456);
  assertEqual(childEnv.get(b), 100);

  const grandchildEnv = createEnv({ outer: childEnv })
    .set(a, 789)
    .set(b, 200);

  assertEqual(parentEnv.get(a), 123);
  assertEqual(childEnv.get(a), 456);
  assertEqual(grandchildEnv.get(a), 789);

  assertEqual(childEnv.get(b), 100);
  assertEqual(grandchildEnv.get(b), 200);
});
