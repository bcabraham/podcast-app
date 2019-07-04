const axios = require("axios");
const Parser = require("rss-parser");

const { utils } = require("../utils/utils");
const { Logger } = require("../utils/logger");

require("dotenv").config();
Logger.init(process.env.LOG_FILE_PATH);

const parser = new Parser();

const searchPodcast = searchTerm => {
  Logger.debug("service.searchPodcast", "start", "");

  let reqURL = `https://itunes.apple.com/search?term=${encodeURIComponent(
    searchTerm
  )}&entity=podcast&media=podcast`;

  Logger.debug("service.searchPodcast", "reqURL", reqURL);

  return axios
    .get(reqURL)
    .then(res => {
      Logger.debug("service.searchPodcast", "Success", "");

      let results = res.data.results;
      Logger.debug("service.searchPodcast", "results", results);

      let response = {
        success: true,
        status: 200,
        message: "Success",
        data: []
      };

      if (results && results.length > 0) {
        response.data = results.map(item => {
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

        Logger.debug("service.searchPodcast", "podcasts", response.data);
      } else if (results.length === 0) {
        Logger.debug("service.searchPodcast", "no results found", "");

        response.success = false;
        response.status = 404;
        response.message = "no results found";
      } else {
        Logger.debug("service.searchPodcast", "bad request", "");

        response.success = false;
        response.status = 400;
        response.message = "bad request";
      }

      return response;
    })
    .catch(err => {
      Logger.error("service.searchPodcast", "Error", err);
      return {
        success: false,
        status: 500,
        message: "Error",
        data: []
      };
    });
};

const searchRSSFeed = feedUrl => {
  Logger.debug("service.searchRSSFeed", "start", "");

  return parser
    .parseURL(feedUrl)
    .then(res => {
      Logger.debug("service.searchPodcast", "Success", "");
      Logger.debug("service.searchPodcast", "results", res);

      let response = {
        success: true,
        status: 200,
        message: "Success",
        data: res
      };

      Logger.debug("service.searchRSSFeed", "end", "");

      return response;
    })
    .catch(err => {
      Logger.error("service.searchRSSFeed", "Error", err);
      return {
        success: false,
        status: 500,
        message: "Error",
        data: []
      };
    });
};

module.exports.apple_service = {
  searchPodcast,
  searchRSSFeed
};
