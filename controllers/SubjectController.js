const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");

const responseObject = (ok, err, subjects) => {
    return {
        ok: ok,
        err: err,
        body: {
            subjects: subjects
        }
    }
}

router.route("/")
    .get((req, res) => {
        console.log("GET: /subjects");
        Subject.find((err, responseObjects) => {
            if (err) {
                res.send(responseObject(false, err, []));
            }
            res.send(responseObject(true, "", responseObjects));
        });
    })
    .post((req, res) => {
        console.log("POST: /subjects");
        if (!req.body) {
            res.send(responseObject(false, "No HTTP body found for POST request.", []));
        } else if (!req.body.subjects) {
            res.send(responseObject(false, "HTTP body malformed: empty or missing 'subjects' field.", []));
        }
        for (let bodySubject of req.body.subjects) {
            let subject = new Subject();
            subject.symbol = bodySubject.symbol;
            subject.name = bodySubject.name;

            subject.save(err => {
                if (err) {
                    res.send(responseObject(false, err, []));
                }
                res.send(responseObject(true, "", []));
            })
        }

    })
    .delete((req, res) => {
        console.log("DELETE: /subjects");
        Subject.deleteMany(err => {
            if (err) {
                res.send(responseObject(false, err, []));
            }
            res.send(responseObject(true, "", []));
        });
    })

module.exports = router;