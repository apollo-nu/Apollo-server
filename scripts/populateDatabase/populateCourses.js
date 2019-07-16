"use strict";

const axios = require("axios");
const config = require("../../config/db").development; //change this between prod/dev when needed
const logger = require("../../src/logger");

const COURSE_API_URL = "https://api.asg.northwestern.edu/courses/details/";
const APOLLO_API_URL_LATEST_TERM = config.host + "/terms";
const APOLLO_API_URL_SUBJECTS = config.host + "/subjects";
const APOLLO_API_URL_COURSES = config.host + "/courses";

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
                "term": term,
                "subject": subject.symbol
            }
        })
            .then(response => {
                const data = response.data;
                if (data.error) {
                    logger.error(data.error);
                }
                for (let course of data) {
                    course.subject = subject._id;
                }
                postCourses(data);
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

module.exports = getLatestTerm;