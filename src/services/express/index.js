console.log("load express");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const { logger, stream } = require("../logger");
const { notFound, errorHandler } = require("../../services/response/");
const api = require("../../api");
const { env } = require("../../config");


module.exports = (args) => {
  const app = express();

  // Middleware
  // app.use(express.static(__dirname + "/public"));
  app.use(express.json());

  if (env === "production" || env === "development") {
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev", { stream }));
  }

  // routes
  app.use("/api", api);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
