export const repl = str => {
  console.log("about to read str", str);
  const evaledResult = str; // TODO: implement eval oh and read and print
  return `[Printed]: ${evaledResult}`;
};
