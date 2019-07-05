const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const helmet = require("helmet");
app.use(helmet());

const env = "" + process.env.NODE_ENV;
console.log("ENV: " + env);
const config = require('./config/db')[env || "dev"];

const mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true });

const CourseController = require("./controllers/CourseController");
const DefaultController = require("./controllers/DefaultController");
const SubjectController = require("./controllers/SubjectController");
const UserController = require("./controllers/UserController");

app.use("/course", CourseController);
app.use("", DefaultController);
app.use("/subject", SubjectController);
app.use("/user", UserController);

const PORT = process.env.PORT || 8081;
app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);

//ping heroku to keep app awake (sleeps after 30 mins)
if (env === "production") {
    const axios = require("axios");
    setInterval(() => {
        axios.get(config.host + "/");
    }, 1750000);
}

module.exports = app;