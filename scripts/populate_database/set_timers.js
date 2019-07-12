"use strict"

const logger = require("../../src/logger");

const PING_TIMER = 1750000; //~29 mins
const SUBJECT_TIMER = 123456789 //DO NOT USE! -> this number must fit in a 32 bit signed int or it will default to 1
const COURSE_TIMER = 604800000; //1 week

function ping() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(config.host + "/");
    }, PING_TIMER);
}

function populateSubjects() {
    logger.warn("Do not set this function (populateSubjects) on a timer.");
    setInterval(() => {
        require("./populate_subjects")();
    }, SUBJECT_TIMER);
}

function populateCourses() {
    setInterval(() => {
        require("./populate_courses")();
    }, COURSE_TIMER);
}

module.exports = () => {
    logger.info("Running database population scripts.");
    ping();
    //populateSubjects();
    populateCourses();
}