const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const response = require("../src/responseBody");

router.route("/")
    .get((req, res) => {
        console.log("GET: /courses");
        Course.find((err, courses) => {
            if (err) {
                res.send(response(false, err, {courses: []}));
            }
            res.send(response(true, "", {courses: courses}));
        })
    })
    .post((req, res) => {
        console.log("POST: /courses");
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request.", {courses: []}));
        } else if (!req.body.courses) {
            res.send(response(false, "HTTP body malformed: empty or missing 'courses' field.", {courses: []}));
        }
        for (let bodyCourse of req.body.courses) {
            let course = new Course();
            course.initialize(bodyCourse, req.body.custom);
            course.save(err => {
                if (err) {
                    res.send(response(false, err, {courses: []}));
                }
            })
        }
        res.send(response(true, "", {courses: []}));
    })
    .delete((req, res) => { //CHANGE THIS TO FIND AND REPLACE RATHER THAN DELETE
        console.log("DELETE: /courses");
        Course.deleteMany({custom: false}, err => {
            if (err) {
                res.send(response(false, err, {courses: []}));
            }
            res.send(response(true, "", {courses: []}));
        })
    })

module.exports = router;