const creds = require("../secret.js");

const config = {
    "dev":{
        "host":"http://localhost:8081",
        "database":`mongodb+srv://cooperfbarth:${creds.mongoPW}@apollo-oq2zz.mongodb.net/test?retryWrites=true&w=majority`
    },
    "production":{
        "host":"https://apollo-nu.herokuapp.com",
        "database":`mongodb+srv://cooperfbarth:${creds.mongoPW}@apollo-oq2zz.mongodb.net/prod?retryWrites=true&w=majority` // Create separate database for production
    }
};
module.exports = config;