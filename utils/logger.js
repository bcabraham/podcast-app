const fs = require("fs");

const init = _filepath => {
  module.exports.Logger.filepath = String(_filepath);
  module.exports.Logger.stream = fs.createWriteStream(
    module.exports.Logger.filepath,
    {
      flags: "a"
    }
  );
};

const debug = (source, message, detail) => {
  let severity = "Debug";
  let logDate = new Date().toISOString();
  let data = {
    logDate,
    severity,
    source,
    message,
    detail
  };

  module.exports.Logger.log(data);
};

const error = (source, message, detail) => {
  let severity = "Error";
  let logDate = new Date().toISOString();
  let data = {
    logDate,
    severity,
    source,
    message,
    detail
  };

  module.exports.Logger.log(data);
};

const warn = (source, message, detail) => {
  let severity = "Warn";
  let logDate = new Date().toISOString();
  let data = {
    logDate,
    severity,
    source,
    message,
    detail
  };

  module.exports.Logger.log(data);
};

const log = data => {
  let dataString;
  try {
    dataString = JSON.stringify(data);
  } catch (e) {
    console.log("Error saving data", data); //eslint-disable-line no-console
    dataString = e;
  }
  // eslint-disable-next-line no-console
  console.log(
    `[${data.severity}] ${data.logDate}: ${data.source} - ${data.message}`
  );

  module.exports.Logger.stream.write(dataString + "\n");
};

const write = data => {
  let dataString;
  try {
    dataString = String(data);
  } catch (e) {
    console.log("Error saving data", data); //eslint-disable-line no-console
    dataString = e;
  }

  module.exports.Logger.stream.write(dataString + "\n");
};

const info = data => {
  let dataString;
  try {
    dataString = String(data);
    console.log(dataString); //eslint-disable-line no-console
  } catch (e) {
    console.log("Error displaying data"); //eslint-disable-line no-console
  }
};

module.exports.Logger = {
  init,
  debug,
  error,
  warn,
  log,
  write,
  info
};
