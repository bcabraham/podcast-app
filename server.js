const express = require("express");
const axios = require("axios");

const { utils } = require("./utils/utils");
const { Logger } = require("./utils/logger");

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
  Logger.debug("/search", "/search/req", req.body);

  let { searchTerm } = req.body;

  Logger.debug("/search/searchTerm", searchTerm, "");

  let reqURL = `https://itunes.apple.com/search?term=${encodeURIComponent(
    searchTerm
  )}&entity=podcast&media=podcast`;

  Logger.debug("/search/reqURL", reqURL, "");

  axios.get(reqURL).then(response => {
    let results = response.data.results;

    if (results && results.length > 0) {
      const podcasts = results.map(item => {
        const {
          collectionId,
          artistName,
          feedUrl,
          artworkUrl30,
          artworkUrl60,
          artworkUrl100,
          genreIds,
          genres
        } = utils.pick(item, [
          "collectionId",
          "artistName",
          "feedUrl",
          "artworkUrl30",
          "artworkUrl60",
          "artworkUrl100",
          "genreIds",
          "genres"
        ]);

        return {
          collectionId,
          artistName,
          feedUrl,
          artworkUrl30,
          artworkUrl60,
          artworkUrl100,
          genreIds,
          genres
        };
      }, []);

      Logger.debug("/search/podcasts", "Success", podcasts);

      res.status(200).send(podcasts);
    } else if (results.length === 0) {
      Logger.debug("/search/podcasts", "no results found", "");

      res.status(404).send();
    } else {
      Logger.debug("/search", "bad request", "");
      res.status(400).send();
    }
  });
});

app.listen(PORT, () => {
  Logger.debug("app.listen:PORT", `Started server on port ${PORT}`, "");
});

module.exports = { app };
