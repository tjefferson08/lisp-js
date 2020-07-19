import { repl} from "./repl.js";
import { List, Vector } from "./utils.js";

const { assert, assertEqual, test } = window;

test("basic math and variables", () => {
    let result = repl("(+ 1 2)")
    assertEqual(result, "3")
    result = repl("(def! a (+ 1 2 3 4))")
    assertEqual(result, "10")
    result = repl("(def! b (- 10 2 1))")
    assertEqual(result, "7")
    result = repl("(* a b 2)")
    assertEqual(result, "140")
});

// TODO: helper to reset repl environment (to avoid test pollution)
test("functions", () => {
    let result = repl("(def! inc2 (fn* (i) (+ 2 i)))")
    assertEqual(result, "#<function>")
    result = repl("(inc2 11)")
    assertEqual(result, "13")
});
