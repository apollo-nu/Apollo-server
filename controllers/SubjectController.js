const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const response = require("../src/responseBody");

router.route("/")
    .get((req, res) => {
        console.log("GET: /subjects");
        Subject.find((err, subjects) => {
            if (err) {
                res.send(response(false, err, {subjects: []}));
            }
            res.send(response(true, "", {subjects: subjects}));
        });
    })
    .post((req, res) => {
        console.log("POST: /subjects");
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request.", {subjects: []}));
        } else if (!req.body.subjects) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subjects' field.", {subjects: []}));
        }
        for (let bodySubject of req.body.subjects) {
            let subject = new Subject();
            subject.initialize(bodySubject, false);
            subject.save(err => {
                if (err) {
                    res.send(response(false, err, {subjects: []}));
                }
            })
        }
        res.send(response(true, "", {subjects: []}));
    })
    .delete((req, res) => {
        console.log("DELETE: /subjects");
        Subject.deleteMany(err => {
            if (err) {
                res.send(response(false, err, {subjects: []}));
            }
            res.send(response(true, "", {subjects: []}));
        });
    })

module.exports = router;