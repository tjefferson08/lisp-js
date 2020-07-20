import { repl, reload } from "./repl.js";
import { List, Vector } from "./utils.js";

const { assert, assertEqual, assertSymbolNotFound, test } = window;

test("basic math and variables", () => {
  let result = repl("(+ 1 2)");
  assertEqual(result, "3");
  result = repl("(def! a (+ 1 2 3 4))");
  assertEqual(result, "10");
  result = repl("(def! b (- 10 2 1))");
  assertEqual(result, "7");
  result = repl("(* a b 2)");
  assertEqual(result, "140");
});

test("reload helper should reset repl env", () => {
  let result = repl("(def! a 123)");
  assertEqual(result, "123");
  result = repl("a");
  assertEqual(result, "123");

  reload();

  assertSymbolNotFound(() => repl("a"));
  result = repl("(def! a true)");
  assertEqual(result, "true");
  result = repl("a");
  assertEqual(result, "true");
});

test("functions", () => {
  let result = repl("(def! inc2 (fn* (i) (+ 2 i)))");
  assertEqual(result, "#<function>");
  result = repl("(inc2 11)");
  assertEqual(result, "13");
});

test("eval", () => {
  let result = repl('(eval (list + 1 2 3))');
  assertEqual(result, "6");
});
