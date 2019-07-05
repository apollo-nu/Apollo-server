const axios = require("axios");
const creds = require("../secret"); //use environmental variable instead
const config = require('../config/db')["dev"]; //change this between prod/dev when needed

COURSE_API_URL = "https://api.asg.northwestern.edu/subjects";
APOLLO_API_URL = config.host + "/subjects";

axios.get(COURSE_API_URL, {
    params: {
        "key": creds.apiKey
    }
})
    .then(response => {
        const subjects = response.data;
        axios.delete(APOLLO_API_URL)
            .then(response => {
                response = response.data;
                if (!response.ok) {
                    console.log(response.err);
                } else {
                    axios.post(APOLLO_API_URL, {
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
            })
            .catch(err => {
                console.log(err);
            })
    })
    .catch(err => {
        console.log(err);
    })