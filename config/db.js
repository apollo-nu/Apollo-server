const creds = require("../secret.js");

// Create separate database for production
const config = {
    "dev":{
        "host":"localhost",
        "database":`mongodb+srv://cooperfbarth:${creds.mongoPW}@apollo-oq2zz.mongodb.net/test?retryWrites=true&w=majority`
    },
    "production":{
        "host":"https://apollo-nu.herokuapp.com/",
        "database":`mongodb+srv://cooperfbarth:${creds.mongoPW}@apollo-oq2zz.mongodb.net/test?retryWrites=true&w=majority`
    }
};
module.exports = config;