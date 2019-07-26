"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RowSchema = new Schema({
    term: {type: Schema.Types.ObjectId, ref: "Term"},
    board: {type: Schema.Types.ObjectId, ref: "Board"}
});

RowSchema.statics.create = function(obj) {
    let row = new mongoose.model("Row", RowSchema)();
    row.term = obj.term;
    row.board = obj.board;
    return row;
};

module.exports = mongoose.model("Row", RowSchema);