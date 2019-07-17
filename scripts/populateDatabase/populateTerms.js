"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const env = process.env.NODE_ENV || "development";
const host = require("../../config/db")[env].host;

const COURSE_API_URL = "https://api.asg.northwestern.edu/terms";
const APOLLO_API_URL = host + "/terms";

function populateTerms() {
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