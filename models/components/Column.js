"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColumnSchema = new Schema({
    term: {type: Schema.Types.ObjectId, ref: "Term"},
    board: {type: Schema.Types.ObjectId, ref: "Board"}
});

ColumnSchema.statics.create = function(obj) {
    let column = new mongoose.model("Column", ColumnSchema)();
    column.term = obj.term;
    column.board = obj.board;
    return column;
};

module.exports = mongoose.model("Column", ColumnSchema);