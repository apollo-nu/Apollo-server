const response = require("../constructors/responseBody");
const jwt = require("jsonwebtoken");

/*
-token is given to client upon login and stored in the client
-token is passed in to each request as a header
-if token has expired, log user out, otherwise keep logged in
*/
function authenticate(req, res, next) {
    const token = req.headers["access-token"];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, err => {
            if (err) {
                res.send(response(false, err));
            } else {
                next();
            }
        })
    } else {
        res.send(response(false, "No token provided"));
    }
}

module.exports = authenticate;