"use strict";

const axios = require("axios");
const logger = require("../../src/logger");

const COURSE_API_URL = "https://api.asg.northwestern.edu/courses/details/";
let APOLLO_API_URL_LATEST_TERM;
let APOLLO_API_URL_SUBJECTS;
let APOLLO_API_URL_COURSES;

function populateCourses(host) {
    if (!host) {
        logger.info("Host not specified; defaulting to development environment.");
        host = require("../../config/db").development.host;
    }
    APOLLO_API_URL_LATEST_TERM = host + "/terms/latest";
    APOLLO_API_URL_SUBJECTS = host + "/subjects";
    APOLLO_API_URL_COURSES = host + "/courses";
    getLatestTerm();
}

function getLatestTerm() {
    axios.get(APOLLO_API_URL_LATEST_TERM)
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
    axios.get(APOLLO_API_URL_SUBJECTS)
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