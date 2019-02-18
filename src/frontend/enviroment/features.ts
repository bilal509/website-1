export const browserSupportsWebsockets = (() => {
  return "WebSocket" in window || "MozWebSocket" in window;
})();
