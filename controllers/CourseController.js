const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const response = require("../src/constructors/responseBody");
const authenticate = require("../src/middleware/authenticate");

router.route("/")
    .all(authenticate)
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
            res.send(response(false, "No HTTP body found for POST request.", {}));
        } else if (!req.body.course || req.body.course) {
            res.send(response(false, "HTTP body malformed: empty or missing 'course' field.", {}));
        }

        let course = new Course();
        course.initialize(req.body.course, req.body.custom);
        course.save(err => {
            if (err) {
                res.send(response(false, err, {}));
            }
        });
        res.send(response(true, "", {}));
    })

router.route("/update")
    .post((req, res) => {
        console.log("POST: /courses/refresh");
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request.", {}));
        } else if (!req.body.courses) {
            res.send(response(false, "HTTP body malformed: empty or missing 'courses' field.", {}));
        }
        let courses = req.body.courses;
        courses = typeof(courses) === "string"? [courses] : courses;
        for (let bodyCourse of courses) {
            Course.findOneAndReplace(
                {
                    id: bodyCourse.id,
                    custom: false
                },
                {$set: {
                    custom: false,
                    id: bodyCourse.id,
                    title: bodyCourse.title,
                    school: bodyCourse.school,
                    subject: bodyCourse.subject,
                    attributes: bodyCourse.attributes,
                    requirements: bodyCourse.requirements
                }},
                {upsert: true},
                err => {
                    res.send(err? response(false, err) : response(true, `Course ${bodyCourse.id} POSTed successfully.`));
                }
            )
        }
    })

module.exports = router;