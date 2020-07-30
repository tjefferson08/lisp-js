import { in_pairs, List, Vector } from "./utils.js";

const buildReader = tokens => ({
  next() {
    if (!tokens.length) {
      throw new Error("EOF");
    }
    const [nextToken, ...remaining] = tokens;
    return [nextToken, buildReader(remaining)];
  },
  peek() {
    if (!tokens.length) {
      throw new Error("EOF");
    }
    return tokens[0];
  }
});

const TOKEN_REGEXP = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/;
const tokenize = input_str => {
  const tokens = [];
  let index = 0;

  // TODO: use a generator here!
  while (index < input_str.length) {
    const str = input_str.slice(index);
    const match = str.match(TOKEN_REGEXP);
    const token = match[1];
    tokens.push(token);
    index += match[0].length;
  }
  return tokens;
};

const read_list = (reader, { closingToken, builder }) => {
  const value_list = [];
  let currentReader = reader;
  while (currentReader.peek()[0] !== closingToken) {
    let [value, nextReader] = read_form(currentReader);
    currentReader = nextReader;
    value_list.push(value);
  }
  // consume closing ')/]/}'
  let [_nextToken, nextReader] = currentReader.next();
  currentReader = nextReader;

  return [builder(value_list), currentReader];
};

const read_atom = reader => {
  const [nextToken, newReader] = reader.next();
  if (nextToken.match(/^[-]?\d+$/)) {
    return [Number(nextToken), newReader];
  } else if (["true", "false"].includes(nextToken)) {
    return [nextToken === "true", newReader];
  } else if (nextToken === "nil") {
    return [null, newReader];
  } else if (nextToken.match(/^[:]\w+$/)) {
    return [Symbol.for(nextToken), newReader];
  } else if (nextToken.match(/^["].*["]?$/)) {
    if (!nextToken.match(/^["].*["]$/)) {
      throw new Error("EOF");
    }
    return [nextToken.match(/^["](.*)["]$/)[1], newReader];
  } else {
    return [Symbol.for(nextToken), newReader];
  }
};

const COLLECTION_DATA = {
  "(": {
    openingToken: "(",
    closingToken: ")",
    builder: value_arr => List.of(...value_arr)
  },
  "[": {
    openingToken: "[",
    closingToken: "]",
    builder: value_arr => Vector.of(...value_arr)
  },
  "{": {
    openingToken: "{",
    closingToken: "}",
    builder: value_arr => new Map([...in_pairs(value_arr)])
  }
};

const READER_MACROS_BY_SYNTAX = {
  "@": "deref",
  "'": "quote",
  "`": "quasiquote",
  "~": "unquote",
  "~@": "splice-unquote"
};

const read_form = reader => {
  const top = reader.peek();
  if (Object.keys(COLLECTION_DATA).includes(top[0])) {
    const [_, nextReader] = reader.next();
    return read_list(nextReader, COLLECTION_DATA[top[0]]);
  } else if (READER_MACROS_BY_SYNTAX[top]) {
    const [_, nextReader] = reader.next();
    const [macroTarget, readerAfterMacro] = read_form(nextReader);
    return [
      List.of(Symbol.for(READER_MACROS_BY_SYNTAX[top]), macroTarget),
      readerAfterMacro
    ];
  } else {
    return read_atom(reader);
  }
};

export const read_str = input_str => {
  const reader = buildReader(tokenize(input_str));

  const [value, _newReader] = read_form(reader);
  return value;
};
