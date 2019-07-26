const express = require("./services/express");
const {
  env, mongo, port, ip,
} = require("./config");

// const mongoose = require('./services/mongoose');

const app = express();

setImmediate(() => {
  app.listen(port, ip, () => {
    console.log(`Express server listening on http://${ip}:${port}, in ${env} mode`); // eslint-disable-line no-console
  });
});

module.exports = app;
