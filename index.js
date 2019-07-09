"use strict";

const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const bpConfig = {limit: "10mb", extended: true};
app.use(bodyParser.urlencoded(bpConfig));
app.use(bodyParser.json(bpConfig));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const helmet = require("helmet");
app.use(helmet());

const env = "" + process.env.NODE_ENV;
console.log("ENV: " + env);

const config = require("./config/db")[env || "dev"];
const mongoose = require("mongoose");
mongoose.connect(config.database, { useNewUrlParser: true });

const CourseController = require("./controllers/CourseController");
const DefaultController = require("./controllers/DefaultController");
const SubjectController = require("./controllers/SubjectController");
const UserController = require("./controllers/UserController");

app.use("/courses", CourseController);
app.use("", DefaultController);
app.use("/subjects", SubjectController);
app.use("/users", UserController);

const PORT = process.env.PORT || 8081;
app.listen(PORT);
console.log("Application listening on PORT: " + PORT);

if (env === "production") {
    require("./scripts/populate_database/set_timers")();
}

module.exports = app;