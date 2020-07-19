export const create = ({ outer, env = new Map(), binds = [] } = {}) => {
  const environment = {
    env,
    set(symbol, mal) {
      const newEnv = create({
        outer,
        env: new Map([...this.env, [symbol, mal]])
      });
      return newEnv;
    },
    // There's gotta be a better way :thinking_face:
    // How do you preserve the linked-listy-ness of nested environments while also making changes to the a parent env like REPL_ENV (with def!)
    setGlobal(symbol, mal) {
      this.findGlobal().env.set(symbol, mal);
      return this;
    },
    find(symbol) {
      if (env.has(symbol)) {
        return env;
      }
      if (outer) {
        return outer.find(symbol);
      }

      throw new Error(`Symbol '${Symbol.keyFor(symbol)}' not found`);
    },
    findGlobal() {
      if (outer) {
        return outer.findGlobal();
      } else {
        return this;
      }
    },
    get(symbol) {
      return this.find(symbol).get(symbol);
    }
  };

  return binds.reduce((acc, [bind, expr]) => acc.set(bind, expr), environment);
};
