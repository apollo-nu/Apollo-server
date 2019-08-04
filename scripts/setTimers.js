"use strict";

const PING_TIMER = 1750000; // ~29 mins
const TERM_TIMER = 604800000; // 1 week
const SUBJECT_TIMER = Math.pow(2, 31) - 1; // max 32-bit int, ~24 days
const COURSE_TIMER = 604800000; // 1 week

const logger = require("./../src/logger");
const env = process.env.NODE_ENV || "development";
const clientHost = require("./../config/db")[env].clientHost;
const host = require("./../config/db")[env].host;

function pingClient() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(clientHost + "/");
    }, PING_TIMER);
}

function pingServer() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(host + "/");
    }, PING_TIMER);
}

function populateTerms() {
    setInterval(() => {
        require("./populateDatabase/populateTerms")();
    }, TERM_TIMER);
}

function populateSubjects() {
    setInterval(() => {
        require("./populateDatabase/populateSubjects")();
    }, SUBJECT_TIMER);
}

function populateCourses() {
    setInterval(() => {
        require("./populateDatabase/populateCourses")();
    }, COURSE_TIMER);
}

module.exports = () => {
    logger.info("Running database population scripts.");
    pingClient();
    pingServer();
    populateTerms();
    populateSubjects();
    populateCourses();
};