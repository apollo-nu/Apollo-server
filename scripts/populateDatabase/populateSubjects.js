"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const env = process.env.NODE_ENV || "development";
const host = require("../../config/config")[env].host;

const COURSE_API_URL = "https://api.asg.northwestern.edu/subjects";
const APOLLO_API_URL = host + "/subjects";

function populateSubjects() {
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