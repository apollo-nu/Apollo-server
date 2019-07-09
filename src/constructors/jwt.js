const jwt = require("jsonwebtoken");

function jwtToken(payload, expires) {
    const options = {
        expiresIn: expires
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = jwtToken;