const express = require('express');
const router = express.Router();

const Course = require('../models/Course');

const responseObject = (ok, err, courses) => {
    return {
        ok: ok,
        err: err,
        body: {
            courses: courses
        }
    }
}

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
        Course.find((err, responseObjects) => {
            if (err) {
                res.send(responseObject(false, err, []));
            }
            res.send(responseObject(true, "", responseObjects));
        })
    })
    .post((req, res) => {
        console.log("POST: /courses");
        if (!req.body) {
            res.send(responseObject(false, "No HTTP body found for POST request.", []));
        } else if (!req.body.courses) {
            res.send(responseObject(false, "HTTP body malformed: empty or missing 'courses' field.", []));
        }
        for (let bodyCourse of req.body.courses) {
            courseSchema(bodyCourse).save(err => {
                if (err) {
                    res.send(responseObject(false, err, []));
                }
            })
        }
        res.send(responseObject(true, "", []));
    })
    .delete((req, res) => {
        console.log("DELETE: /courses");
        Course.deleteMany(err => {
            if (err) {
                res.send(responseObject(false, err, []));
            }
            res.send(responseObject(true, "", []));
        })
    })

module.exports = router;