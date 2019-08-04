"use strict";

module.exports = {
    "development":{
        "host":"http://localhost:8081",
        "clientHost":"http://localhost:3000",
        "database":`mongodb+srv://dev:${process.env.MONGO_PW_DEV}@apollo-oq2zz.mongodb.net/test?retryWrites=true&w=majority`
    },
    "production":{
        "host":"https://apollo-nu.herokuapp.com/api",
        "clientHost":"https://apollo-nu.herokuapp.com/",
        "database":`mongodb+srv://prod:${process.env.MONGO_PW_PROD}@apollo-oq2zz.mongodb.net/prod?retryWrites=true&w=majority`
    }
};