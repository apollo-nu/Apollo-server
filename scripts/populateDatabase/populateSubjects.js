"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const COURSE_API_URL = "https://api.asg.northwestern.edu/subjects";
let APOLLO_API_URL, scriptSecret;

function populateSubjects(host, secret) {
    if (!secret) {
        logger.warn("Secret not specified in call to setTimers, aborting.");
        return;
    } else if (!host) {
        logger.info("Host not specified; defaulting to development environment.");
        host = require("../../config/db").development.host;
    }
    scriptSecret = secret;
    APOLLO_API_URL = host + "/subjects";
    getSubjects();
}

function getSubjects() {
    axios.get(COURSE_API_URL, {
        params: {
            "key": process.env.API_KEY
        }
    })
        .then(response => {
            const subjects = response.data;
            if (subjects.error) {
                logger.error(subjects.error);
            } else {
                refreshSubjects(subjects);
            }
        })
        .catch(err => {
            logger.error(err);
        });
}

function refreshSubjects(subjects) {
    axios.post(APOLLO_API_URL + "/update", {
        headers: {
            auth: process.env.SCRIPT_SECRET
        },
        subjects: subjects
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

module.exports = populateSubjects;