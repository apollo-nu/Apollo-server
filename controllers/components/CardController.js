"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Card = require("../../models/components/Card");
const Subject = require("../../models/data/Subject");

router.route("/:id")
    .all(authenticate)
    .delete((req, res) => {
        const id = req.params.id;
        Card.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/row/:rowId")
    .all(authenticate)
    .get((req, res) => {
        const rowId = req.params.rowId;
        Card.find({row: rowId})
            .populate({
                path: 'course',
                populate: {
                    path: 'subject'
                }
            })
            .exec((err, cards) => {
                res.send(err? response(false, err) : response(true, "", {cards: cards}));
            });
        })
    .post((req, res) => {
        if (!(req.body && req.body.course)) {
            res.send(response(false, "HTTP body missing or malformed in POST request to /user/:userId"));
        }
        const card = Card.create({
            row: req.params.rowId,
            course: req.body.course
        });
        card.save((err, cardRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: cardRes._id}));
        });
    })
    .patch((req, res) => {
        Card.findOneAndUpdate({_id: req.body.cardId}, {
            row: req.params.rowId
        }, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

module.exports = router;