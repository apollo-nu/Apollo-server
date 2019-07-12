"use strict";

module.exports = (ok, message, body) => {
    return {
        ok: ok,
        message: message,
        body: body
    };
};