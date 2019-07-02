const express = require("express");
const axios = require("axios");
const fs = require("fs");

var app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

// app.use(express.static(__dirname + "/public")); // dirname always holds the absolute path to the current directory the app is in.

// Serve landing page
app.get("/", (req, res) => {
  res.status(200).send("<h2>hello there</h2>");
});

app.get("/greet", (req, res) => {
  res.status(200).send({ message: "hello there" });
});

app.get("/search/", (req, res) => {
  logger("debug", "/search/req", req.body);

  let { searchTerm } = req.body;

  logger("debug", "/search/searchTerm", searchTerm);

  let reqURL = `https://itunes.apple.com/search?term=${encodeURIComponent(
    searchTerm
  )}&entity=podcast&media=podcast`;

  logger("debug", "/search/reqURL", reqURL);

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
        } = pick(item, [
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

      logger("debug", "/search/podcasts", podcasts);

      res.status(200).send(podcasts);
    } else if (results.length === 0) {
      logger("debug", "/search", "no results found");
      res.status(404).send();
    } else {
      logger("debug", "/search", "bad request");
      res.status(400).send();
    }
  });
});

app.listen(PORT, () => {
  logger("Debug", "app.listen:PORT", `Started server on port ${PORT}`);
});

module.exports = { app };

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

var stream = fs.createWriteStream("server.log", { flags: "a" });

const logger = (severity, source, message) => {
  let logDate = new Date().toISOString();
  let data = {
    logDate,
    severity,
    source,
    message
  };

  let dataString;
  try {
    dataString = JSON.stringify(data);
  } catch (e) {
    console.log(data); //eslint-disable-line no-console
    dataString = e;
  }

  stream.write(dataString + "\n");
};
