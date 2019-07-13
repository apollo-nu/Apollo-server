"use strict";

const env = "" + process.env.NODE_ENV;
const config = require("../../config/db")[env || "development"];
const logger = require("../../src/logger");

const PING_TIMER = 1750000; // ~29 mins
const SUBJECT_TIMER = Math.pow(2, 31) - 1; // max 32-bit int, ~24 days
const COURSE_TIMER = 604800000; // 1 week

function ping() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(config.host + "/");
    }, PING_TIMER);
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
    ping();
    populateSubjects();
    populateCourses();
};