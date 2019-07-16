"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");
const authenticate = require("../src/middleware/authenticate");
const logger = require("../src/logger");

const Term = require("../models/Term");

router.route("/")
    .get((_req, res) => {
        Term.find((err, terms) => {
            res.send(err? response(false, err) : response(true, "", {terms: terms}));
        });
    })
    .all(authenticate)
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.term) {
            res.send(response(false, "HTTP body malformed: empty or missing 'term' field."));
        }
        const term = Term.create(req.body.term);
        term.save(err => {
            res.send(err? response(false, err) : response(true, "Term POSTed successfully."));
        });
    });

router.route("/latest")
    .get((_req, res) => {
        Term.find()
            .sort({start_date:-1})
            .limit(1)
            .exec((err, term) => {
                res.send(err? response(false, err) : response(true, "", {term: term[0]}));
            });
    });

router.route("/update")
    .post((req, res) => {
        if (!req.body) {
            res.send(response(false, "No HTTP body found for POST request."));
        } else if (!req.body.terms) {
            res.send(response(false, "HTTP body malformed: empty or missing 'terms' field."));
        }
        let terms = req.body.terms;
        terms = typeof(terms) === "string"? [terms] : terms;
        for (let term of terms) {
            term = Term.create(term);
            delete term._id;
            Term.findOneAndReplace({id: term.id}, term.toObject(), {upsert: true}, err => {
                if (err) {
                    logger.error(err);
                }
            });
        }
        res.send(response(true, "Operation finished."));
    });

module.exports = router;