const axios = require("axios");
const creds = require("../secret"); //use environmental variable instead
const config = require('../config/db')["dev"]; //change this between prod/dev when needed

COURSE_API_URL = "https://api.asg.northwestern.edu/courses/";
APOLLO_API_URL_SUBJECTS = config.host + "/subjects";
APOLLO_API_URL_COURSES = config.host + "/courses";

DEFAULT_TERMS = [4576, 4577, 4578, 4579]; //Fall 2018, Winter 2019, Spring 2019, Summer 2019

function getSubjects() {
    axios.get(APOLLO_API_URL_SUBJECTS)
        .then(response => {
            response = response.data;
            if (!response.ok) {
                console.log(response.err);
            } else {
                getCourses(response.body.subjects);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function getCourses(subjects) {
    let responseCount = 0;
    let courses = [];
    //should be about 1400 queries; we only have 10000 per day, so be careful.
    for (let subject of subjects) {
        for (let term of DEFAULT_TERMS) {
            axios.get(COURSE_API_URL, {
                params: {
                    "key": creds.apiKey,
                    "term": term,
                    "subject": subject.symbol
                }
            })
                //if there are errors of any kind, we want to abort ASAP.
                .then(response => {
                    const data = response.data
                    courses = courses.concat(data);
                    if (data.error) {
                        console.log(data.error);
                    } else if (++responseCount === subjects.length) {
                        refreshCourses(courses);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

function refreshCourses(courses) {
    axios.delete(APOLLO_API_URL_COURSES)
        .then(response => {
            response = response.data;
            if (!response.ok) {
                console.log(response.err);
            } else {
                axios.post(APOLLO_API_URL_COURSES, {
                    courses: courses
                })
                    .then(response => {
                        response = response.data;
                        if (!response.ok) {
                            console.log(response.err);
                        } else {
                            console.log(response);
                        }
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
}

getSubjects();
module.exports = getSubjects;