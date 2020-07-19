import { read_str } from "./reader.js";
import { List, Vector } from "./utils.js";

const { assert, assertEqual, test } = window;

const runTestCases = cases =>
  cases.forEach(({ input, expected }) => {
    const actual = read_str(input);
    assertEqual(actual, expected);
  });

test("numbers", () => {
  const cases = [{ input: "1", expected: 1 }, { input: "100", expected: 100 }];

  runTestCases(cases);
});

test("boolean & nil", () => {
  const cases = [
    { input: "true", expected: true },
    { input: "false", expected: false },
    { input: "nil", expected: null }
  ];

  runTestCases(cases);
});

test("symbols", () => {
  const cases = [
    { input: "abc", expected: Symbol.for("abc") },
    { input: "def", expected: Symbol.for("def") }
  ];

  runTestCases(cases);
});

test("keywords", () => {
  const cases = [
    { input: ":abc", expected: Symbol.for(":abc") },
    { input: ":def", expected: Symbol.for(":def") }
  ];

  runTestCases(cases);
});

test("strings", () => {
  const cases = [
    { input: '"hello world"', expected: "hello world" },
    {
      input: '"abcdefghijklmnopqrstuvwxyz1234567890 +-*/ ()"',
      expected: "abcdefghijklmnopqrstuvwxyz1234567890 +-*/ ()"
    }
    // TODO, newlines, escaped double quotes
  ];

  runTestCases(cases);
});

test("vectors", () => {
  const cases = [
    { input: "[1 2 3]", expected: Vector.of(1, 2, 3) },
    {
      input: '["1" true :hi nil 2]',
      expected: Vector.of("1", true, Symbol.for(":hi"), null, 2)
    }
  ];

  cases.forEach(({ input, expected }) => {
    const actual = read_str(input);
    assertEqual(actual, expected);
    assert(actual instanceof Vector);
  });
});

test("lists", () => {
  const cases = [
    { input: "(1 2 3)", expected: List.of(1, 2, 3) },
    {
      input: '("1" true :hi nil 2)',
      expected: List.of("1", true, Symbol.for(":hi"), null, 2)
    }
  ];

  cases.forEach(({ input, expected }) => {
    const actual = read_str(input);
    assertEqual(actual, expected);
    assert(actual instanceof List);
  });
});

test("maps", () => {
  const cases = [
    {
      input: '{:hi "world" 1 2}',
      expected: new Map([[Symbol.for(":hi"), "world"], [1, 2]])
    }
  ];

  cases.forEach(({ input, expected }) => {
    const actual = read_str(input);
    assertEqual([...actual.entries()], [...expected.entries()]);
    assert(actual instanceof Map);
  });
});
