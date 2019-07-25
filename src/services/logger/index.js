const { createLogger, format, transports } = require("winston");

const decolorizedJson = format.combine(format.uncolorize(), format.json());

const logger = createLogger({
  level: "info",
  transports: [
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new transports.File({
      format: decolorizedJson,
      filename: "logs/error.log",
      level: "error",
    }),
    new transports.File({
      format: decolorizedJson,
      filename: "logs/combined.log",
    }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
const colorizedCli = format.combine(format.colorize(), format.cli());

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: colorizedCli,
    }),
  );
}
module.exports = logger;
module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};
