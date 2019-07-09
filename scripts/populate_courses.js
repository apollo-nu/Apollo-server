const axios = require("axios");
const config = require("../config/db")["dev"]; //change this between prod/dev when needed

COURSE_API_URL = "https://api.asg.northwestern.edu/courses/";
APOLLO_API_URL_SUBJECTS = config.host + "/subjects";
APOLLO_API_URL_COURSES = config.host + "/courses";

DEFAULT_TERMS = [4720, 4730, 4740, 4750]; //Fall 2018, Winter 2019, Spring 2019, Fall 2019

function getSubjects(term) {
    axios.get(APOLLO_API_URL_SUBJECTS)
        .then(response => {
            response = response.data;
            if (!response.ok) {
                console.log(response.err);
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
            console.log(err);
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
                const data = response.data
                courses = courses.concat(data);
                if (data.error) {
                    console.log(data.error);
                } else if (++responseCount === subjects.length) {
                    refreshCourses(courses);
                }
            })
            .catch(err => {
                console.log(`Could not retrieve data for subject ${subject.symbol}.`);
                if (++responseCount === subjects.length) {
                    refreshCourses(courses);
                }
                //console.log(err);
            })
    }
}

function refreshCourses(courses) {
    axios.post(APOLLO_API_URL_COURSES + "/refresh", {
        courses: courses
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                console.log(response.err);
            }
        })
}

//getSubjects();
module.exports = getSubjects;