const axios = require("axios");
const Parser = require("rss-parser");

const { utils } = require("../utils");

require("dotenv").config();


const parser = new Parser();

const searchPodcast = (searchTerm) => {
  const reqURL = `https://itunes.apple.com/search?term=${encodeURIComponent(
    searchTerm,
  )}&entity=podcast&media=podcast`;


  return axios
    .get(reqURL)
    .then((res) => {
      const { results } = res.data;

      const response = {
        success: true,
        status: 200,
        message: "Success",
        data: [],
      };

      if (results && results.length > 0) {
        response.data = results.map((item) => {
          const {
            collectionId,
            artistName,
            feedUrl,
            artworkUrl30,
            artworkUrl60,
            artworkUrl100,
            genreIds,
            genres,
          } = utils.pick(item, [
            "collectionId",
            "artistName",
            "feedUrl",
            "artworkUrl30",
            "artworkUrl60",
            "artworkUrl100",
            "genreIds",
            "genres",
          ]);

          return {
            collectionId,
            artistName,
            feedUrl,
            artworkUrl30,
            artworkUrl60,
            artworkUrl100,
            genreIds,
            genres,
          };
        }, []);
      } else if (results.length === 0) {
        response.success = false;
        response.status = 404;
        response.message = "no results found";
      } else {
        response.success = false;
        response.status = 400;
        response.message = "bad request";
      }

      return response;
    })
    .catch(err => ({
      success: false,
      status: 500,
      message: "Error",
      data: [],
    }));
};

const searchRSSFeed = feedUrl => parser
  .parseURL(feedUrl)
  .then((res) => {
    const response = {
      success: true,
      status: 200,
      message: "Success",
      data: res,
    };


    return response;
  })
  .catch(err => ({
    success: false,
    status: 500,
    message: "Error",
    data: [],
  }));

// const searchListenAPI = (searchTerm) => {
// curl -X GET --include 'https://listen-api.listennotes.com/api/v2/best_podcasts' -H 'X-ListenAPI-Key: LISTEN_API_KEY'
// Applications using the Listen API must not pre-fetch, cache, index, or store any content on the server side.
// Note that the id and the pub_date (e.g., latest_pub_date_ms, pub_date_ms...) of a podcast or an episode are exempt from the caching restriction.
// };

module.exports = {
  searchPodcast,
  searchRSSFeed,
};
