const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebSocket = require("ws");
const http = require("http");

const createClientJs = ({ host, port }) => `
  const ws = new WebSocket("ws://${host}:${port}");

  ws.onmessage = event => {
    const message = event.data;
    
    switch(event.data){
      case 'COMPILED': {
        window.location.reload();
      }
    }
  };
`;

module.exports = class ReloadBrowserPlugin {
  constructor(options) {
    this.options = options;

    const clientJs = createClientJs(options);

    this.httpServer = http.createServer({}, (request, response) => {
      if (request.url === "/client.js") {
        response.end(clientJs);
      }
    });

    this.wsServer = new WebSocket.Server({
      server: this.httpServer
    });

    this.wsArray = [];
    this.wsServer.on("connection", ws => {
      const currentId = Date.now();

      this.wsArray.push({
        id: currentId,
        ws
      });

      ws.on("close", () => {
        this.wsArray = this.wsArray.filter(({ id }) => {
          return id !== currentId;
        });
      });
    });

    this.httpServer.listen(options.port);

    process.stdin.resume(); //so the program will not close instantly

    const exitHandler = (options, exitCode) => {
      if (options.cleanup) {
        this.httpServer.close(() => {
          process.exit();
        });
      }
    };

    //do something when app is closing
    process.on("exit", exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on("SIGINT", exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
  }

  apply(compiler) {
    const { host, port } = this.options;

    compiler.hooks.done.tap("ReloadBrowserPlugin", () => {
      this.wsArray.forEach(({ ws }) => {
        ws.send("COMPILED");
      });
    });

    compiler.hooks.compilation.tap("ReloadBrowserPlugin", compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "ReloadBrowserPlugin",
        (data, cb) => {
          data.assetTags.scripts.push({
            tagName: "script",
            voidTag: false,
            attributes: {
              src: `http://${host}:${port}/client.js`
            }
          });

          cb(null, data);
        }
      );
    });
  }
};
