const PING_TIMER = 1750000; //~29 mins
const SUBJECT_TIMER = 31536000000; //1 year
const COURSE_TIMER = 604800000; //1 week

function ping() {
    const axios = require("axios");
    setInterval(() => {
        axios.get(config.host + "/");
    }, PING_TIMER);
}

function populateSubjects() {
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
    ping();
    populateSubjects();
    populateCourses();
}