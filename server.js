const express = require("express");
const axios = require("axios");

const { utils } = require("./utils/utils");
const { Logger } = require("./utils/logger");
const { apple_service } = require("./service/apple.service");

require("dotenv").config();

Logger.init(process.env.LOG_FILE_PATH);

var app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

// app.use(express.static(__dirname + "/public")); // dirname always holds the absolute path to the current directory the app is in.

// Serve landing page
app.get("/", (req, res) => {
  Logger.debug("/", "GET", req.body);
  res.status(200).send("<h2>hello there</h2>");
});

app.get("/greet", (req, res) => {
  Logger.debug("/greet", "GET", req.body);
  res.status(200).send({ message: "hello there" });
});

app.get("/search", (req, res) => {
  Logger.debug("/search GET", "req", req.body);

  let { searchTerm } = req.body;

  Logger.debug("/search GET", `searchTerm: ${searchTerm}`, "");

  apple_service
    .searchPodcast(searchTerm)
    .then(response => {
      if (response && response.success) {
        Logger.debug("/search GET", response.status, response.podcasts);
        res.status(response.status).send(response.podcasts);
      } else {
        Logger.debug("/search GET", response.status, response.message);
        res.status(response.status).send(response.message);
      }
    })
    .catch(err => {
      Logger.error("/search GET", "Error processing request", err);
    });
});

app.listen(PORT, () => {
  Logger.debug("app.listen:PORT", `Started server on port ${PORT}`, "");
});

module.exports = { app };
