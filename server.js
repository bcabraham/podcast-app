const express = require("express");
const fs = require("fs");

var app = express();
const PORT = process.env.PORT || 3001;

// app.use(express.static(__dirname + "/public")); // dirname always holds the absolute path to the current directory the app is in.

// Serve landing page
app.get("/", (req, res) => {
  res.status(200).send("<h2>hello there</h2>");
});

app.get("/greet", (req, res) => {
  res.status(200).send({ message: "hello there" });
});

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`); // eslint-disable-line no-console
});

module.exports = { app };
