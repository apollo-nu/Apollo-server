"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Column = require("../../models/components/Column");

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params.id;
        Column.findById(id, (err, column) => {
            res.send(err? response(false, err) : response(true, "", {column: column}));
        });
    })
    .patch((req, res) => {
        const id = req.params.id;
        Column.findByIdAndUpdate(id, req.body.column, (err, column) => {
            res.send(err? response(false, err) : response(true, "", {column: column}));
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        Column.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/board/:boardId")
    .all(authenticate)
    .get((req, res) => {
        const boardId = req.params.boardId;
        Column.find({board: boardId})
            .populate("term")
            .exec((err, columns) => {
                res.send(err? response(false, err) : response(true, "", {columns: columns}));
            })
    })
    .post((req, res) => {
        if (!(req.body && req.body.term)) {
            res.send(response(false, "HTTP body missing or malformed in POST request to /board/:boardId"));
        }
        const column = Column.create({
            column: req.body.term,
            board: req.params.boardId
        });
        column.save((err, columnRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: columnRes._id}));
        });
    });

module.exports = router;