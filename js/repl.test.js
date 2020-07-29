import { repl, reload } from "./repl.js";
import { List, Vector } from "./utils.js";

const { assertEqual, assertSymbolNotFound, test } = window;

test("basic math and variables", () => {
  reload();
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
  reload();
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
  reload();
  let result = repl("(def! inc2 (fn* (i) (+ 2 i)))");
  assertEqual(result, "#<function>");
  result = repl("(inc2 11)");
  assertEqual(result, "13");

  result = repl(
    "(def! sum2 (fn* (n acc) (if (= 0 n) acc (sum2 (- n 1) (+ 1 acc)))))"
  );
  assertEqual(result, "#<function>");
  result = repl("(sum2 100 0)");
  assertEqual(result, "100");
});

test("eval", () => {
  reload();
  let result = repl("(eval (list + 1 2 3))");
  assertEqual(result, "6");
});

test("slurp", () => {
  reload();
  window.scriptFileContent = "here is raw text";

  // slurp takes no args, just yanks whatever's in the global
  let result = repl("(slurp)");
  assertEqual(result, '"here is raw text"');
});

test("atoms", () => {
  reload();

  let result = repl("(def! a (atom 1))");
  assertEqual(result, "(atom 1)");

  result = repl("[(deref a) @a]");
  assertEqual(result, "[1 1]");

  result = repl("(reset! a 100)");
  assertEqual(result, "100");

  result = repl("[(deref a) @a]");
  assertEqual(result, "[100 100]");

  result = repl("(swap! a + 100)");
  assertEqual(result, "200");

  result = repl("[(deref a) @a]");
  assertEqual(result, "[200 200]");

  result = repl("(swap! a (fn* (atom-val inc-amt) (+ atom-val inc-amt)) 25)");
  assertEqual(result, "225");

  result = repl("[(deref a) @a]");
  assertEqual(result, "[225 225]");

  result = repl("(atom? a)");
  assertEqual(result, "true");

  result = repl("(atom? 100)");
  assertEqual(result, "false");
});

test("cons", () => {
  reload();

  let result = repl("(cons 1 (list 2 3))");
  assertEqual(result, "(1 2 3)");

  result = repl("(cons 1 (list))");
  assertEqual(result, "(1)");

  result = repl("(cons (list 1 2) (list 3 4))");
  assertEqual(result, "((1 2) 3 4)");
});

test("concat", () => {
  reload();

  let result = repl("(concat (list 1) (list 2 3) (list 4 5))");
  assertEqual(result, "(1 2 3 4 5)");

  result = repl("(concat (list 1) (list))");
  assertEqual(result, "(1)");

  result = repl("(concat (list) (list 1 2) (list (list 3 4)))");
  assertEqual(result, "(1 2 (3 4))");
});

test("quote", () => {
  reload();

  let result = repl("(quote (1 2 3))");
  assertEqual(result, "(1 2 3)");

  result = repl("(quote abc)");
  assertEqual(result, "abc");

  result = repl("(def! xs (quote (+ 1 2 3)))");
  assertEqual(result, "(+ 1 2 3)");
  result = repl("(eval xs)");
  assertEqual(result, "6");
});

test("quasiquote", () => {
  reload();

  let result = repl("(quasiquote (1 2 3))");
  assertEqual(result, "(1 2 3)");

  result = repl("(quasiquote abc)");
  assertEqual(result, "abc");

  result = repl("(def! lst (quote (2 3 abc)))");
  assertEqual(result, "(2 3 abc)");

  result = repl("(quasiquote (1 (unquote lst)))");
  assertEqual(result, "(1 (2 3 abc))");

  result = repl("(quasiquote (1 (splice-unquote lst)))");
  assertEqual(result, "(1 2 3 abc)");
});
