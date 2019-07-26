const router = require("express").Router();

const podcasts = require("./podcasts");

router.use("/podcasts", podcasts);

router.get("/greet", (req, res) => {
  res.status(200).send({ message: "hello there" });
});

module.exports = router;
