const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const response = require("../src/responseBody");

const courseSchema = (courseObject) => {
    let course = new Course();
    course.id = courseObject.id;
    course.title = courseObject.title;
    course.school = courseObject.school;
    course.subject = courseObject.subject;
    course.attributes = courseObject.attributes;
    course.requirements = courseObject.requirements;
    return course
}

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
            courseSchema(bodyCourse).save(err => {
                if (err) {
                    res.send(response(false, err, {courses: []}));
                }
            })
        }
        res.send(response(true, "", {courses: []}));
    })
    .delete((req, res) => {
        console.log("DELETE: /courses");
        Course.deleteMany(err => {
            if (err) {
                res.send(response(false, err, {courses: []}));
            }
            res.send(response(true, "", {courses: []}));
        })
    })

module.exports = router;