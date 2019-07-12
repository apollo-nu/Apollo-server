"use strict";

const axios = require("axios");
const config = require("../../config/db").development; //change this between prod/dev when needed
const logger = require("../../src/logger");

const COURSE_API_URL = "https://api.asg.northwestern.edu/subjects";
const APOLLO_API_URL = config.host + "/subjects";

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

module.exports = getSubjects;