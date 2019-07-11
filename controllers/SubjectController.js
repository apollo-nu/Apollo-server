const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const response = require("../src/constructors/responseBody");
const authenticate = require("../src/middleware/authenticate");
const logger = require("../src/logger");

router.route("/")
    .all(authenticate)
    .get((_req, res) => {
        Subject.find((err, subjects) => {
            res.send(err? response(false, err) : response(true, "", {subjects: subjects}));
        });
    })
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.subject) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subject' field."));
        }
        const subject = Subject.create(req.body.subject, false);
        subject.save(err => {
            res.send(err? response(false, err) : response(true, "Subjects POSTed successfully."));
        })
    })

router.route("/update")
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.subjects) {
            res.send(response(false, "HTTP body malformed: empty or missing 'subjects' field."));
        }

        let subjects = req.body.subjects;
        subjects = typeof(subjects) === "string"? [subjects] : subjects;
        for (let bodySubject of subjects) {
            bodySubject.custom = false;
            Subject.findOneAndReplace(bodySubject, bodySubject, {upsert: true}, err => {
                if (err) {
                    logger.error(err);
                }
            });
        }
        res.send(response(true, "Operation finished."));
    })

module.exports = router;