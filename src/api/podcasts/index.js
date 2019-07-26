const router = require("express").Router();

const { searchPodcast, searchRSSFeed } = require("../../services/search.service");

router.get("/search", (req, res) => {
  const { searchTerm } = req.body;

  searchPodcast(searchTerm)
    .then((response) => {
      if (response && response.success) {
        res.status(response.status).send(response.data);
      } else {
        res.status(response.status).send(response.message);
      }
    })
    .catch((err) => {
      res.status(500).send("An error occurred");
    });
});

router.get("/searchRSS", (req, res) => {
  const { feedUrl } = req.body;

  searchRSSFeed(feedUrl)
    .then((response) => {
      if (response && response.success) {
        res.status(response.status).send(response.data);
      } else {
        res.status(response.status).send(response.message);
      }
    })
    .catch((err) => {
      res.status(500).send("An error occurred");
    });
});

module.exports = router;
