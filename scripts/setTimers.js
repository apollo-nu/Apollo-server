"use strict";

const PING_TIMER = 1750000; // ~29 mins
const TERM_TIMER = 604800000; // 1 week
const SUBJECT_TIMER = Math.pow(2, 31) - 1; // max 32-bit int, ~24 days
const COURSE_TIMER = 604800000; // 1 week

const logger = require("./../src/logger");

function ping(host) {
    const axios = require("axios");
    setInterval(() => {
        axios.get(host + "/");
    }, PING_TIMER);
}

function populateTerms(host, secret) {
    setInterval(() => {
        require("./populateDatabase/populateTerms")(host, secret);
    }, TERM_TIMER);
}

function populateSubjects(host, secret) {
    setInterval(() => {
        require("./populateDatabase/populateSubjects")(host, secret);
    }, SUBJECT_TIMER);
}

function populateCourses(host, secret) {
    setInterval(() => {
        require("./populateDatabase/populateCourses")(host, secret);
    }, COURSE_TIMER);
}

module.exports = (host, secret) => {
    if (!secret) {
        logger.warn("Secret not specified in call to setTimers, aborting.");
        return;
    } else if (!host) {
        logger.info("Host not specified; defaulting to development environment.");
        host = require("../../config/db").development.host;
    }

    logger.info("Running database population scripts.");
    ping(host);
    populateTerms(host, secret);
    populateSubjects(host, secret);
    populateCourses(host, secret);
};