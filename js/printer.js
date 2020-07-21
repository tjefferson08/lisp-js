import { Atom, List, Vector, is_symbol, is_keyword } from "./utils.js";

export const pr_str = (malData, printReadably = true) => {
  const helper = malData => {
    if (malData === null) {
      return "nil";
    }

    if (is_symbol(malData) || is_keyword(malData)) {
      return Symbol.keyFor(malData);
    }

    if (
      typeof malData === "function" ||
      (typeof malData === "object" && typeof malData.fn === "function")
    ) {
      return "#<function>";
    }

    if (typeof malData === "string") {
      if (printReadably) {
        return `"${malData}"`;
      } else {
        return malData;
      }
    }

    if (typeof malData === "number" || typeof malData === "boolean") {
      return malData.toString();
    }

    if (malData instanceof List) {
      return "(" + malData.map(_malData => helper(_malData)).join(" ") + ")";
    }

    if (malData instanceof Vector) {
      return "[" + malData.map(_malData => helper(_malData)).join(" ") + "]";
    }

    if (malData instanceof Map) {
      return (
        "{" +
        [...malData]
          .flatMap(a => a)
          .map(_malData => helper(_malData))
          .join(" ") +
        "}"
      );
    }

    if (Atom.is_atom(malData)) {
      return `(atom ${helper(malData.value)})`;
    }

    return "UNKNOWN";
  };

  return helper(malData);
};
