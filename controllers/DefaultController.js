"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");

// Used to ping the server to keep it awake
router.route("/")
    .get((_req, res) => {
        res.send(response(true, "App is running."));
    });

module.exports = router;