const {createLogger, format, transports} = require("winston");
const env = process.env.NODE_ENV;
const level = env === "production"? "info" : "debug";

const fs = require("fs");
const path = require("path");
const logDir = "log";
if (fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const filename = path.join(logDir, `${env}.log`);

const logFormat = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

module.exports = createLogger({
    level: level,
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss.sss"
        }),
        logFormat
    ),
    transports: [
        new transports.Console({
            level: level,
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),
        new transports.File({filename})
    ]
});