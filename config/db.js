module.exports = {
    "dev":{
        "host":"http://localhost:8081",
        "database":`mongodb+srv://cooperfbarth:${process.env.MONGO_PW}@apollo-oq2zz.mongodb.net/test?retryWrites=true&w=majority`
    },
    "production":{
        "host":"https://apollo-nu.herokuapp.com",
        "database":`mongodb+srv://cooperfbarth:${process.env.MONGO_PW}@apollo-oq2zz.mongodb.net/prod?retryWrites=true&w=majority`
    }
};