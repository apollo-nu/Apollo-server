"use strict";

const PING_TIMER = 1750000; // ~29 mins
const TERM_TIMER = 604800000; // 1 week
const SUBJECT_TIMER = Math.pow(2, 31) - 1; // max 32-bit int, ~24 days
const COURSE_TIMER = 604800000; // 1 week

const logger = require("./../src/logger");
const env = process.env.NODE_ENV || "development";
const host = require("./../config/db")[env].host;

function ping() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(host + "/");
    }, PING_TIMER);
}

function populateTerms() {
    const terms = require("./populateDatabase/populateTerms");
    terms();
    setInterval(() => {
        terms();
    }, TERM_TIMER);
}

function populateSubjects() {
    const subjects = require("./populateDatabase/populateSubjects");
    setTimeout(() => subjects(), 10000);
    setInterval(() => {
        subjects();
    }, SUBJECT_TIMER);
}

function populateCourses() {
    const courses = require("./populateDatabase/populateCourses");
    setTimeout(() => courses(), 20000);
    setInterval(() => {
        courses();
    }, COURSE_TIMER);
}

module.exports = () => {
    logger.info("Running database population scripts.");
    ping();
    populateTerms();
    populateSubjects();
    populateCourses();
};