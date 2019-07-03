const axios = require("axios");

const { utils } = require("../utils/utils");
const { Logger } = require("../utils/logger");

require("dotenv").config();
Logger.init(process.env.LOG_FILE_PATH);

const searchPodcast = searchTerm => {
  Logger.debug("apple.searchPodcast", "start", "");

  let reqURL = `https://itunes.apple.com/search?term=${encodeURIComponent(
    searchTerm
  )}&entity=podcast&media=podcast`;

  Logger.debug("apple.searchPodcast", "reqURL", reqURL);

  return axios
    .get(reqURL)
    .then(res => {
      Logger.debug("apple.searchPodcast", "Success", "");

      let results = res.data.results;
      Logger.debug("apple.searchPodcast", "results", results);

      let response = {
        success: true,
        status: 200,
        message: "Success",
        podcasts: []
      };

      if (results && results.length > 0) {
        response.podcasts = results.map(item => {
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

        Logger.debug("apple.searchPodcast", "podcasts", response.podcasts);
      } else if (results.length === 0) {
        Logger.debug("apple.searchPodcast", "no results found", "");

        response.success = false;
        response.status = 404;
        response.message = "no results found";
      } else {
        Logger.debug("apple.searchPodcast", "bad request", "");

        response.success = false;
        response.status = 400;
        response.message = "bad request";
      }

      return response;
    })
    .catch(err => {
      Logger.error("apple.searchPodcast", "Error", err);
      return {
        success: false,
        status: 500,
        message: "Error",
        podcasts: []
      };
    });
};

module.exports.apple_service = {
  searchPodcast
};
