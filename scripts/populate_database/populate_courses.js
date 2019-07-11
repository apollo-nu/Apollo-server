const axios = require("axios");
const config = require("../../config/db")["development"]; //change this between prod/dev when needed
const logger = require("../../src/logger");

COURSE_API_URL = "https://api.asg.northwestern.edu/courses/";
APOLLO_API_URL_SUBJECTS = config.host + "/subjects";
APOLLO_API_URL_COURSES = config.host + "/courses";

DEFAULT_TERMS = [4720, 4730, 4740, 4750]; //Fall 2018, Winter 2019, Spring 2019, Fall 2019

function getSubjects(term) {
    axios.get(APOLLO_API_URL_SUBJECTS)
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            } else {
                if (term) {
                    getCourses(response.body.subjects, term);
                } else {
                    for (let defaultTerm of DEFAULT_TERMS) {
                        getCourses(response.body.subjects, defaultTerm);
                    }
                }
            }
        })
        .catch(err => {
            logger.error(err);
        })
}

function getCourses(subjects, term) {
    let responseCount = 0;
    let courses = [];
    //should be about 400 queries per term; we only have 10000 per day, so be careful.
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
                for (course of data) {
                    course.subject = subject._id;
                }
                courses = courses.concat(data);
                if (data.error) {
                    logger.error(data.error);
                } 
                if (++responseCount === subjects.length) {
                    refreshCourses(courses);
                }
            })
            .catch(_err => {
                logger.warn(`Could not retrieve data for subject ${subject.symbol}.`);
                if (++responseCount === subjects.length) {
                    refreshCourses(courses);
                }
            })
    }
}

function refreshCourses(courses) {
    axios.post(APOLLO_API_URL_COURSES + "/update", {
        courses: courses
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                logger.error(response.message);
            }
        })
}

module.exports = getSubjects;