const axios = require("axios");
const config = require("../../config/db")["dev"]; //change this between prod/dev when needed

COURSE_API_URL = "https://api.asg.northwestern.edu/subjects";
APOLLO_API_URL = config.host + "/subjects";

function getSubjects() {
    axios.get(COURSE_API_URL, {
        params: {
            "key": process.env.API_KEY
        }
    })
        .then(response => {
            const subjects = response.data;
            refreshSubjects(subjects);
        })
        .catch(err => {
            console.log(err);
        })
}

function refreshSubjects(subjects) {
    axios.post(APOLLO_API_URL + "/update", {
        subjects: subjects
    })
        .then(response => {
            response = response.data;
            if (!response.ok) {
                console.log(response.err);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = getSubjects;