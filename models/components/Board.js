"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"}
});

BoardSchema.statics.create = function(obj) {
    let board = new mongoose.model("Board", BoardSchema)();
    board.user = obj.user;
    return board;
};

module.exports = mongoose.model("Board", BoardSchema);