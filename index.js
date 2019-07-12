"use strict";

const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

// Parses request bodies
const bodyParser = require("body-parser");
const bpConfig = {limit: "10mb", extended: true};
app.use(bodyParser.urlencoded(bpConfig));
app.use(bodyParser.json(bpConfig));

// Forces non-HTTPS routes to redirect
// const https = require("./src/middleware/https");
// app.use(https);

// Adds CORS headers to requests
const cors = require("./src/middleware/cors");
app.use(cors);

// Logging
const morgan = require("./src/middleware/morgan");
app.use(morgan.loggingErr);
app.use(morgan.loggingOut);

// Parses cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Sets various security-related HTTP headers
const helmet = require("helmet");
app.use(helmet());

const logger = require("./src/logger");
const env = "" + process.env.NODE_ENV;
logger.info("ENV: " + env);

const config = require("./config/db")[env || "development"];
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
logger.info("Application listening on PORT: " + PORT);
logger.debug({hi: "hi", yo: "yo"})

if (env === "production") {
    require("./scripts/populate_database/set_timers")();
}

module.exports = app;