import { read_str } from "./reader.js";
import { pr_str } from "./printer.js";

export const repl = str => {
  const readResult = read_str(str);
  const evaledResult = readResult; // TODO: implement eval oh and read and print
  const printedResult = pr_str(evaledResult);
  return `[Printed]: ${printedResult}`;
};
