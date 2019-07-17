"use strict";

const PING_TIMER = 1750000; // ~29 mins
const TERM_TIMER = 604800000; // 1 week
const SUBJECT_TIMER = Math.pow(2, 31) - 1; // max 32-bit int, ~24 days
const COURSE_TIMER = 604800000; // 1 week

const logger = require("./../src/logger");
let host;

function ping() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(host + "/");
    }, PING_TIMER);
}

function populateTerms() {
    setInterval(() => {
        require("./populateDatabase/populateTerms")(host);
    }, TERM_TIMER);
}

function populateSubjects() {
    setInterval(() => {
        require("./populateDatabase/populateSubjects")(host);
    }, SUBJECT_TIMER);
}

function populateCourses() {
    setInterval(() => {
        require("./populateDatabase/populateCourses")(host);
    }, COURSE_TIMER);
}

module.exports = (serverHost) => {
    host = serverHost || require("../../config/db").development.host;

    logger.info("Running database population scripts.");
    ping();
    populateTerms();
    populateSubjects();
    populateCourses();
};