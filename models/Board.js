"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    name: String,
    rows: [{type: Schema.Types.ObjectId, ref: "Row"}]
});

BoardSchema.statics.create = function(obj) {
    let board = new mongoose.model("Board", BoardSchema)();

    return board;
};

module.exports = mongoose.model("Board", BoardSchema);