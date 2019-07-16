"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");
const authenticate = require("../src/middleware/authenticate");
const logging = require("../src/logger");

const Course = require("../models/Course");

router.route("/")
    .all(authenticate)
    .get((_req, res) => {
        Course.find()
            .populate("subject")
            .populate("term")
            .exec((err, courses) => {
                res.send(err? response(false, err) : response(true, "", {courses: courses}));
            });
    });

router.route("/custom")
    .all(authenticate)
    .all((req, res, next) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.course || req.body.course) {
            res.send(response(false, "HTTP body malformed: empty or missing 'course' field."));
        } else if (!req.body.userId || req.body.userId) {
            res.send(response(false, "HTTP body malformed: empty or missing 'userId' field."));
        }
        next();
    })
    .post((req, res) => {
        const course = Course.create(req.body.course, true, req.body.userId);
        course.save(err => {
            res.send(err? response(false, err) : response(true, "Course saved."));
        });
    })
    .patch((req, res) => {
        let course = Course.create(req.body.course, true, req.body.userId);
        delete course._id;
        Course.findOneAndReplace({
            title: req.body.course.title,
            user: req.body.userId,
            custom: true
        }, 
        course.toObject(),
        {upsert: true},
        (err, newCourse) => {
            res.send(err? response(false, err) : response(true, "", {course: newCourse}));
        });
    })
    .delete((req, res) => {
        Course.findOneAndDelete({
            title: req.body.course.title,
            user: req.body.userId,
            custom: true
        }, err => {
            res.send(err? response(false, err) : response(true, ""));
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
            let course = Course.create(bodyCourse);
            delete course._id;
            Course.findOneAndReplace(
                {
                    id: bodyCourse.id,
                    custom: false
                },
                course.toObject(),
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