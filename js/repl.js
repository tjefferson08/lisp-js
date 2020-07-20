import { read_str } from "./reader.js";
import { pr_str } from "./printer.js";
import { create as createEnv } from "./env.js";
import { List, Vector, is_symbol, in_pairs, interleave } from "./utils.js";
import * as core from "./core.js";

export const reload = () => {
  REPL_ENV = buildReplEnv();
};

const buildReplEnv = () => {
  let env = createEnv();
  for (let [sym, fn] of core.ns) {
    env = env.set(sym, fn);
  }

  return env.set(Symbol.for("eval"), ast => EVAL(ast, env));
};

// TODO do better than mutating this in lower scopes
let REPL_ENV = buildReplEnv();

const READ = read_str;
const PRINT = pr_str;

const EVAL = (ast, _env) => {
  let env = _env;

  while (true) {
    if (!(ast instanceof List)) {
      return eval_ast(ast, env);
    }

    if (ast.length === 0) {
      return ast;
    }

    const [symbol, ...restOfList] = ast;

    switch (is_symbol(symbol) && Symbol.keyFor(symbol)) {
      case "def!": {
        const [_symbol, binding, value] = ast;
        const evaledValue = EVAL(value, env);
        env.setGlobal(binding, evaledValue);
        return evaledValue;
      }
      case "let*": {
        let innerEnv = createEnv({ outer: REPL_ENV });
        const [_symbol, bindingList, formToEval] = ast;
        for (const [sym, val] of in_pairs(bindingList)) {
          innerEnv = innerEnv.set(sym, EVAL(val, innerEnv));
        }
        env = innerEnv;
        ast = formToEval;
        break;
      }
      case "do": {
        const [_doSymbol, ...exprs] = ast;
        const evaledExprs = exprs
          .slice(0, exprs.length - 1)
          .map(ast => EVAL(ast, env));
        ast = exprs[exprs.length - 1];
        break;
      }
      case "if": {
        const [_ifSymbol, condExpr, ifExpr, elseExpr] = ast;
        const evaledCondExpr = EVAL(condExpr, env);

        // checking for else branch first because the logic is a bit simpler to read
        if (evaledCondExpr === null || evaledCondExpr === false) {
          ast = elseExpr ? elseExpr : null;
        } else {
          ast = ifExpr;
        }
        break;
      }
      case "fn*": {
        const [fnSymbol, params, body] = ast;
        function closure(...args) {
          if (args.length !== params.length) {
            throw new Error(`ArityError: expected ${params.length} params`);
          }
          const fnEnv = createEnv({
            outer: env,
            binds: [...in_pairs(interleave(params, args))]
          });
          return EVAL(body, fnEnv);
        }

        ast = {
          ast: body,
          params,
          env,
          fn: closure
        };
        break;
      }
      default: {
        const evaledList = eval_ast(ast, env);
        const [fn, ...args] = evaledList;
        if (typeof fn === "function") {
          return fn(...args);
        } else {
          ast = fn.ast;
          const newEnv = createEnv({
            outer: fn.env,
            binds: [...in_pairs(interleave(fn.params, args))]
          });
          env = newEnv;
        }
      }
    }
  }
};

const eval_ast = (ast, replEnv) => {
  if (is_symbol(ast)) {
    return replEnv.get(ast);
  }

  if (ast instanceof List || ast instanceof Vector) {
    return ast.map(_ast => EVAL(_ast, replEnv));
  }

  if (ast instanceof Map) {
    return new Map(
      [...ast].map(([keyAst, valAst]) => [
        EVAL(keyAst, replEnv),
        EVAL(valAst, replEnv)
      ])
    );
  }

  return ast;
};

export const repl = str => {
  const readResult = READ(str);
  const evaledResult = EVAL(readResult, REPL_ENV);
  const printedResult = PRINT(evaledResult);
  return printedResult;
};
