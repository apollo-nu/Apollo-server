"use strict";

const dotenv = require("dotenv");
dotenv.config();

const logger = require("./src/logger");
const env = "" + process.env.NODE_ENV;
logger.info("ENV: " + env);

const config = require("./config/db")[env || "development"];
const mongoose = require("mongoose");
mongoose.connect(config.database, { useNewUrlParser: true }, err => {
    if (err) {
        logger.error("Could not connect to database.");
        logger.error(`${err.name}: ${err.errorLabels}`);
        process.exit(1);
    } else {
        logger.info("Connected to database.");
    }
});

const express = require("express");
const app = express();

// Parses request bodies
const bodyParser = require("body-parser");
const bpConfig = {limit: "10mb", extended: true};
app.use(bodyParser.urlencoded(bpConfig));
app.use(bodyParser.json(bpConfig));

// Forces non-HTTPS routes to redirect
// To use, set up SSL and convert to an http/https server
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

const BoardController = require("./controllers/components/BoardController");
const CardController = require("./controllers/components/CardController");
const CourseController = require("./controllers/data/CourseController");
const DefaultController = require("./controllers/DefaultController");
const RowController = require("./controllers/components/RowController");
const SubjectController = require("./controllers/data/SubjectController");
const TermController = require("./controllers/data/TermController");
const UserController = require("./controllers/UserController");

app.use("/boards", BoardController);
app.use("/cards", CardController);
app.use("/courses", CourseController);
app.use("", DefaultController);
app.use("/rows", RowController);
app.use("/subjects", SubjectController);
app.use("/terms", TermController);
app.use("/users", UserController);

const PORT = process.env.PORT || 8081;
app.listen(PORT);
logger.info("Application listening on PORT: " + PORT);

if (env === "production") {
    require("./scripts/setTimers")();
}

module.exports = app;