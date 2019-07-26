"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Row = require("../../models/components/Row");

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params.id;
        Row.findById(id, (err, row) => {
            res.send(err? response(false, err) : response(true, "", {row: row}));
        });
    })
    .patch((req, res) => {
        const id = req.params.id;
        Row.findByIdAndUpdate(id, req.body.row, (err, row) => {
            res.send(err? response(false, err) : response(true, "", {row: row}));
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        Row.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/board/:boardId")
    .all(authenticate)
    .get((req, res) => {
        const boardId = req.params.boardId;
        Row.find({board: boardId}, (err, rows) => {
            res.send(err? response(false, err) : response(true, "", {rows: rows}));
        });
    })
    .post((req, res) => {
        if (!(req.body && req.body.term)) {
            res.send(response(false, "HTTP body missing or malformed in POST request to /board/:boardId"));
        }
        const row = Row.create({
            row: req.body.term,
            board: req.params.boardId
        });
        row.save((err, rowRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: rowRes._id}));
        });
    });

module.exports = router;