"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../src/logger");

const CardSchema = new Schema({
    row: {type: Schema.Types.ObjectId, ref: "Row"},
    course: {type: Schema.Types.ObjectId, ref: "Course"}
});

CardSchema.statics.create = function(obj) {
    let card = new mongoose.model("Card", CardSchema)();
    logger.debug(obj);
    return card;
};

module.exports = mongoose.model("Card", CardSchema);