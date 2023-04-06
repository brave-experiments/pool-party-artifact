self.postMessage("msg");
self.onmessage = function (e) {
  if (e.data === "close") {
    close();
  }
};
