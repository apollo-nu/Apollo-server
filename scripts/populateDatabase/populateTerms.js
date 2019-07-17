"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const COURSE_API_URL = "https://api.asg.northwestern.edu/terms";
let APOLLO_API_URL, scriptSecret;

function populateTerms(host, secret) {
    if (!secret) {
        logger.warn("Secret not specified in call to setTimers, aborting.");
        return;
    } else if (!host) {
        logger.info("Host not specified; defaulting to development environment.");
        host = require("../../config/db").development.host;
    }
    scriptSecret = secret;
    APOLLO_API_URL = host + "/terms";
    getTerms();
}

function getTerms() {
    axios.get(COURSE_API_URL, {
        params: {
            "key": process.env.API_KEY
        }
    })
        .then(response => {
            const terms = response.data;
            if (terms.error) {
                logger.error(terms.error);
            } else {
                refreshTerms(terms);
            }
        })
        .catch(err => {
            logger.error(err);
        });
}

function refreshTerms(terms) {
    axios.post(APOLLO_API_URL + "/update", {
        headers: {
            auth: scriptSecret
        },
        terms: terms
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            }
        })
        .catch(err => {
            logger.error(err);
        });
}

module.exports = populateTerms;