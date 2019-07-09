const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const response = require("../src/helpers/responseBody");
const authenticate = require("../src/middleware/authenticate");

router.route("/")
    .all(authenticate)
    .get((req, res) => {
        console.log("GET: /subjects");
        Subject.find((err, subjects) => {
            res.send(err? response(false, err) : response(true, "", {subjects: subjects}));
        });
    })
    .post((req, res) => {
        console.log("POST: /subjects");
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.subjects) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subjects' field."));
        }
        for (let bodySubject of req.body.subjects) {
            let subject = new Subject();
            subject.initialize(bodySubject, false);
            subject.save(err => {
                if (err) {
                    res.send(response(false, err));
                }
            })
        }
        res.send(response(true, "All subjects POSTed successfully."));
    })

router.route("/update")
    .post((req, res) => {
        console.log("POST: /subjects/refresh");
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.subjects) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subjects' field."));
        }

        let subjects = req.body.subjects;
        subjects = typeof(subjects) === "string"? [subjects] : subjects;
        for (let bodySubject of subjects) {
            Subject.findOneAndReplace(
                {
                    symbol: bodySubject.symbol,
                    custom: false
                },
                {$set: {
                    custom: false,
                    symbol: bodySubject.symbol,
                    name: bodySubject.name
                }},
                {upsert: true},
                err => {
                    res.send(err? response(false, err) : response(true, `Subject ${bodySubject.symbol} POSTed successfully.`));
                }
            )
        }
    })

module.exports = router;