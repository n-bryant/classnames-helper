expect.extend({
  // https://jestjs.io/docs/en/expect.html#expectextendmatchers
  toHaveClass(received, className) {
    const pass = received.split(" ").includes(className);
    if (pass) {
      return {
        message: () =>
          `expected '${received}' to not have class name '${className}'`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected '${received}' to have class name '${className}'`,
        pass: false
      };
    }
  }
});
