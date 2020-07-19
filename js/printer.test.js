import { pr_str } from "./printer.js";
import { List, Vector } from "./utils.js";

const { assert, assertEqual, test } = window;

const runTestCases = cases =>
  cases.forEach(({ input, expected }) => {
    const actual = pr_str(input);
    assertEqual(actual, expected);
  });

test("numbers", () => {
  const cases = [
    { input: 1, expected: "1" },
    { input: 100, expected: "100" },
    { input: -123, expected: "-123" }
  ];

  runTestCases(cases);
});

test("boolean & nil", () => {
  const cases = [
    { input: true, expected: "true" },
    { input: false, expected: "false" },
    { input: null, expected: "nil" }
  ];

  runTestCases(cases);
});

test("symbols", () => {
  const cases = [
    { input: Symbol.for("abc"), expected: "abc" },
    { input: Symbol.for("def"), expected: "def" }
  ];

  runTestCases(cases);
});

test("keywords", () => {
  const cases = [
    { input: Symbol.for(":abc"), expected: ":abc" },
    { input: Symbol.for(":def"), expected: ":def" }
  ];

  runTestCases(cases);
});

test("strings", () => {
  const cases = [
    { input: "hello world", expected: '"hello world"' },
    {
      input: "abcdefghijklmnopqrstuvwxyz1234567890 +-*/ ()",
      expected: '"abcdefghijklmnopqrstuvwxyz1234567890 +-*/ ()"'
    }
    // TODO, newlines, escaped double quotes
  ];

  runTestCases(cases);
});

test("vectors", () => {
  const cases = [
    { input: Vector.of(1, 2, 3), expected: "[1 2 3]" },
    {
      input: Vector.of("1", true, Symbol.for(":hi"), null, 2),
      expected: '["1" true :hi nil 2]'
    }
  ];

  runTestCases(cases);
});

test("lists", () => {
  const cases = [
    { input: List.of(1, 2, 3), expected: "(1 2 3)" },
    {
      input: List.of("1", true, Symbol.for(":hi"), null, 2),
      expected: '("1" true :hi nil 2)'
    }
  ];

  runTestCases(cases);
});

test("maps", () => {
  const cases = [
    {
      input: new Map([[Symbol.for(":hi"), "world"], [1, 2]]),
      expected: '{:hi "world" 1 2}'
    }
  ];

  runTestCases(cases);
});
