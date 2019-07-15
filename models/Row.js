"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../src/logger");

const RowSchema = new Schema({
    quarter: String,
    year: String,
    board: {type: Schema.Types.ObjectId, ref: "Board"}
});

RowSchema.statics.create = function(obj) {
    let row = new mongoose.model("Row", RowSchema)();
    logger.debug(obj);
    return row;
};

module.exports = mongoose.model("Row", RowSchema);