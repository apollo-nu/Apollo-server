"use strict";

const express = require("express");
const router = express.Router();

const response = require("../../src/constructors/responseBody");
const authenticate = require("../../src/middleware/authenticate");

const Board = require("../../models/components/Board");

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params.id;
        Board.findById(id, (err, board) => {
            res.send(err? response(false, err) : response(true, "", {board: board}));
        });
    })
    .patch((req, res) => {
        const id = req.params.id;
        Board.findByIdAndUpdate(id, req.body.board, (err, board) => {
            res.send(err? response(false, err) : response(true, "", {board: board}));
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        Board.findOneAndDelete({_id: id}, err => {
            res.send(err? response(false, err) : response(true));
        });
    });

router.route("/user/:userId")
    .all(authenticate)
    .get((req, res) => {
        const userId = req.params.userId;
        Board.find({user: userId}, (err, boards) => {
            res.send(err? response(false, err) : response(true, "", {boards: boards}));
        });
    })
    .post((req, res) => {
        const board = Board.create({
            user: req.params.userId
        });
        board.save((err, boardRes) => {
            res.send(err? response(false, err) : response(true, "", {_id: boardRes._id}));
        });
    });

module.exports = router;