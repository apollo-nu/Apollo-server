"use strict";

const indicative = require("indicative");
const validate = indicative.validator.validate;
const sanitize = indicative.sanitizer.sanitize;

const deepEqual = require("deep-equal");

const logger = require("../logger");
const options = require("./optionsList");
const response = require("../constructors/responseBody");

module.exports = (data, dataType, callback) => {
    const validateOptions = options[dataType];
    validate(data, validateOptions.rules, validateOptions.messages)
        .then(() => {
            const unsanitizedData = data;
            sanitize(data, validateOptions.schema);
            if (!deepEqual(data, unsanitizedData)) {
                logger.warn(`Input data sanitized: ${JSON.stringify(data)}`);
                callback(response(true, "", {data: data, sanitized: true}));
            } else {
                callback(response(true, "", {data: data, sanitized: false}));
            }
        })
        .catch(err => {
            callback(response(false, err, data));
        });
};