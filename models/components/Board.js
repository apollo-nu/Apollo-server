"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../../src/logger");

const BoardSchema = new Schema({
    
});

BoardSchema.statics.create = function(obj) {
    let board = new mongoose.model("Board", BoardSchema)();
    logger.debug(obj);
    return board;
};

module.exports = mongoose.model("Board", BoardSchema);