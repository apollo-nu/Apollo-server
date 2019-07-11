const {createLogger, format, transports} = require("winston");
const env = process.env.NODE_ENV;
const level = env === "production"? "info" : "debug";

const fs = require("fs");
const logDir = "./log";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const path = require("path");
const filename = path.join(logDir, `${env}.log`);

const curr_file = module.parent.filename.split("/").pop();
const logFormat = format.printf(info => `${info.timestamp} - ${curr_file}:LINE_NUMBER [${info.level}] ${info.message}`);

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