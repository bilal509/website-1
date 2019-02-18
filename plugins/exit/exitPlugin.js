const { emojify } = require("node-emoji");

module.exports = class ExitPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("ExitPlugin", () => {
      return new Promise(() => {
        setTimeout(() => {
          process.exit(0);
        }, 5000);
      });
    });
  }
};
