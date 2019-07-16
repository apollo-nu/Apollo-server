"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");
const logger = require("../src/logger");

const Subject = require("../models/Subject");

router.route("/")
    .get((_req, res) => {
        Subject.find((err, subjects) => {
            res.send(err? response(false, err) : response(true, "", {subjects: subjects}));
        });
    });

router.route("/update")
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.subjects) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subjects' field."));
        }
        for (let bodySubject of req.body.subjects) {
            subject = Subject.create(bodySubject).toObject();
            delete subject._id;
            Subject.findOneAndReplace({
                symbol: subject.symbol,
                custom: false
            }, subject, {upsert: true}, err => {
                if (err) {
                    logger.error(err);
                }
            });
        }
        res.send(response(true, "Operation finished."));
    });

module.exports = router;