"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Card = require("../../models/components/Card");

router.route("/:id")
    .all(authenticate)
    .delete((req, res) => {
        const id = req.params.id;
        Card.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/column/:columnId")
    .all(authenticate)
    .get((req, res) => {
        const columnId = req.params.columnId;
        Card.find({column: columnId})
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
            column: req.params.columnId,
            course: req.body.course
        });
        card.save((err, cardRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: cardRes._id}));
        });
    })
    .patch((req, res) => {
        Card.findOneAndUpdate({_id: req.body.cardId}, {
            column: req.params.columnId
        }, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

module.exports = router;