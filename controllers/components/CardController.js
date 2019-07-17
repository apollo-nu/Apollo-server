"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Card = require("../../models/components/Card");

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params.id;
        Card.findById(id)
            // .populate("user")
            // .populate("row")
            // .populate("board")
            .exec((err, card) => {
                res.send(err? response(false, err) : response(true, "", {card: card}));
            });
    })
    .patch((req, res) => {
        const id = req.params.id;
        Card.findByIdAndUpdate(id, req.body.card, (err, card) => {
            res.send(err? response(false, err) : response(true, "", {card: card}));
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        Card.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/user/:userId")
    .all(authenticate)
    .get((req, res) => {
        const userId = req.params.userId;
        Card.find({userId: userId})
            // .populate("user")
            // .populate("row")
            // .populate("board")
            .exec((err, cards) => {
                res.send(err? response(false, err) : response(true, "", {cards: cards}));
            });
    })
    .post((req, res) => {
        if (!(req.body && req.body.row && req.body.course)) {
            res.send(response(false, "HTTP body missing or malformed in POST request to /user/:userId"));
        }
        const card = Card.create({
            userId: req.params.userId,
            row: req.body.row,
            course: req.body.course
        });
        card.save((err, cardRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: cardRes._id}));
        });
    });

module.exports = router;