"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const env = process.env.NODE_ENV || "development";
const host = require("../../config/db")[env].host;

const COURSE_API_URL = "https://api.asg.northwestern.edu/courses/details/";
const APOLLO_API_URL_LATEST_TERM = host + "/terms/latest";
const APOLLO_API_URL_SUBJECTS = host + "/subjects";
const APOLLO_API_URL_COURSES = host + "/courses";

function populateCourses() {
    getLatestTerm();
}

function getLatestTerm() {
    axios.get(APOLLO_API_URL_LATEST_TERM, {
        headers: {
            auth: process.env.SCRIPT_SECRET
        }
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            } else {
                getSubjects(response.body.term);
            }
        })
        .catch(err => {
            logger.error(err);
        });
}

function getSubjects(term) {
    axios.get(APOLLO_API_URL_SUBJECTS, {
        headers: {
            auth: process.env.SCRIPT_SECRET
        }
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            } else {
                getCourses(response.body.subjects, term);
            }
        })
        .catch(err => {
            logger.error(err);
        });
}

function getCourses(subjects, term) { 
    for (let subject of subjects) {
        axios.get(COURSE_API_URL, {
            params: {
                "key": process.env.API_KEY,
                "term": term.id,
                "subject": subject.symbol
            }
        })
            .then(response => {
                const data = response.data;
                if (data.error) {
                    logger.error(data.error);
                }
                postCourses(data.map(course => {
                    course.subject = subject._id;
                    course.term = term._id;
                    return course;
                }));
            })
            .catch(() => {
                logger.warn(`Could not retrieve data for subject ${subject.symbol}.`);
            });
    }
}

function postCourses(courses) {
    axios.post(APOLLO_API_URL_COURSES + "/update", {
        headers: {
            auth: process.env.SCRIPT_SECRET
        },
        courses: courses
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            }
        });
}

module.exports = populateCourses;