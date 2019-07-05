const axios = require("axios");
const creds = require("../secret"); //use environmental variable instead
const config = require('../config/db')["" + process.env.NODE_ENV || "dev"];

//DROP TABLE if exists

COURSE_API_URL = "https://api.asg.northwestern.edu/courses/details/";
APOLLO_API_URL = config.host + "/courses";
DEFAULT_TERMS = [4576, 4577, 4578, 4579]; //Fall 2018, Winter 2019, Spring 2019, Summer 2019
/*
let courses = [];
for (let subject of WHATEVER SUBJECTS THING HERE) {
    for (let term of DEFAULT_TERMS) {
        axios.get(COURSE_API_URL, {
            params: {
                "key": creds.apiKey,
                "term": term,
                "subject": subject.symbol
            }
        })
            .then(response => {
                courses = courses.concat(response);
            })
            .catch(err => {
                console.log(err);
            })
    }
}
*/
//when courses is full? send to database