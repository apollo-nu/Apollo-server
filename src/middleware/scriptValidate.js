"use strict";

const logger = require("../logger");
const response = require("../constructors/responseBody");

module.exports = (req, res, next) => {
    const scriptSecret = req.headers.auth;
    if (scriptSecret !== process.env.SCRIPT_SECRET) {
        logger.warn("Attempt to run database population script failed: INCORRECT_AUTH_KEY");
        res.send(response(false, "Missing or invalid script key"));
    }
    next();
};