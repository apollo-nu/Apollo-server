"use strict";

const jwt = require("jsonwebtoken");

module.exports = (payload, expires) => {
    const options = {
        expiresIn: expires
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};