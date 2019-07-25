const express = require("express");

// const { utils } = require("./utils");
const { Logger } = require("./utils/logger");
const { apple_service: search_service } = require("./service/search.service");

require("dotenv").config();

Logger.init(process.env.LOG_FILE_PATH);

var app = express();

// Middleware
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

app.get("/searchPodcast", (req, res) => {
  Logger.debug("/searchPodcast GET", "req", req.body);

  let { searchTerm } = req.body;

  Logger.debug("/searchPodcast GET", `searchTerm: ${searchTerm}`, "");

  search_service
    .searchPodcast(searchTerm)
    .then(response => {
      Logger.debug("/searchPodcast GET", response.status, response.message);

      if (response && response.success) {
        res.status(response.status).send(response.data);
      } else {
        res.status(response.status).send(response.message);
      }
    })
    .catch(err => {
      Logger.error("/searchPodcast GET", "Error processing request", err);
      res.status(500).send("An error occurred");
    });
});

app.get("/searchRSSFeed", (req, res) => {
  Logger.debug("/searchRSSFeed GET", "req", req.body);

  let { feedUrl } = req.body;

  Logger.debug("/searchRSSFeed GET", `feedUrl: ${feedUrl}`, "");

  search_service
    .searchRSSFeed(feedUrl)
    .then(response => {
      Logger.debug("/searchRSSFeed GET", response.status, response.message);

      if (response && response.success) {
        res.status(response.status).send(response.data);
      } else {
        res.status(response.status).send(response.message);
      }
    })
    .catch(err => {
      Logger.error("/searchRSSFeed GET", "Error processing request", err);
      res.status(500).send("An error occurred");
    });
});

app.listen(PORT, () => {
  Logger.debug("app.listen:PORT", `Started server on port ${PORT}`, "");
});

module.exports = { app };
