"use strict";

const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Subject = require("../models/Subject");

const response = require("../src/constructors/responseBody");
const authenticate = require("../src/middleware/authenticate");
const logging = require("../src/logger");

router.route("/")
    .all(authenticate)
    .get((_req, res) => {
        Course.find()
            .populate("subject")
            .exec((err, courses) => {
                res.send(err? response(false, err) : response(true, "", {courses: courses}));
            });
    })
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.course || req.body.course) {
            res.send(response(false, "HTTP body malformed: empty or missing 'course' field."));
        }

        Subject.findById(req.body.course.subject, (err, subject) => {
            if (err) {
                res.send(response(false, err));
            } else if (subject) {
                const course = Course.create(req.body.course, req.body.custom);
                course.save(err => {
                    res.send(err? response(false, err) : response(true, "Course saved."));
                });
            } else {
                logging.debug(`Invalid subject id ${req.body.course.subject}.`);
            }
        });
    });

router.route("/update")
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.courses) {
            res.send(response(false, "HTTP body malformed: empty or missing 'courses' field."));
        }
        for (let bodyCourse of req.body.courses) {
            Course.findOneAndReplace(
                {
                    id: bodyCourse.id,
                    custom: false
                },
                {
                    id: bodyCourse.id,
                    title: bodyCourse.title,
                    school: bodyCourse.school,
                    subject: bodyCourse.subject,
                    attributes: bodyCourse.attributes,
                    requirements: bodyCourse.requirements,
                    custom: false
                },
                {upsert: true},
                err => {
                    if (err) {
                        logging.error(err);
                    }
                });
        }
        res.send(response(true, "Operation finished."));
    });

module.exports = router;