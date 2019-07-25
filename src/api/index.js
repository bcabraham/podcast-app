const router = require("express").Router();

const podcasts = require("./podcasts");

router.use("/podcasts", podcasts);

router.get("/", (req, res) => {
  res.status(200).send("<h2>hello there</h2>");
});

router.get("/greet", (req, res) => {
  res.status(200).send({ message: "hello there" });
});

module.exports = router;
