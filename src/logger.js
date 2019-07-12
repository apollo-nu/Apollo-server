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

const logFormat = format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`);

const logger = createLogger({
    level: level,
    transports: [
        new transports.Console({
            level: level,
            format: format.combine(
                format.colorize(),
                    format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss.sss"
                }),
                logFormat
            )
        }),
        new transports.File({filename})
    ]
});

// Concept/Code for filename & line number logging:
// https://gist.github.com/ludwig/b47b5de4a4c53235825af3b4cef4869a
function formatLog(args) {
    args = Array.prototype.slice.call(args)
    // Format JSON
    if (typeof(args[0]) === "string") {

    }

    // Add stack info
    const stackInfo = getStackInfo(1);
    if (stackInfo) {
        const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`;
        args.unshift(calleeStr);
    }
    console.log(args);
    return [args.join(" ")];
}

function getStackInfo(stackIndex) {
    const stacklist = (new Error()).stack.split('\n').slice(3);

    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
        const PROJECT_ROOT = path.join(__dirname, "..");
        return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join("\n")
        };
    }
}

logger.stream = {
    write: (message) => {
        logger.info(message)
    }
}

module.exports.debug = module.exports.log = function() {
    logger.debug.apply(logger, formatLog(arguments));
}

module.exports.info = function() {
    logger.info.apply(logger, formatLog(arguments));
}

module.exports.warn = function() {
    logger.warn.apply(logger, formatLog(arguments));
}

module.exports.error = function() {
    logger.error.apply(logger, formatLog(arguments));
}

module.exports.stream = logger.stream