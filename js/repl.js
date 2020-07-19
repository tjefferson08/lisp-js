import { read_str } from "./reader.js";

export const repl = str => {
  const readResult = read_str(str);
  const evaledResult = readResult; // TODO: implement eval oh and read and print
  return `[Printed]: ${evaledResult}`;
};
