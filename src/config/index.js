const path = require("path");
require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  root: path.join(__dirname, "../.."),
  port: process.env.PORT || 5000,
  ip: process.env.IP || "localhost",
  mongo: "",
};
