"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    column: {type: Schema.Types.ObjectId, ref: "Column"},
    course: {type: Schema.Types.ObjectId, ref: "Course"}
});

CardSchema.statics.create = function(obj) {
    let card = new mongoose.model("Card", CardSchema)();
    card.column = obj.column;
    card.course = obj.course;
    return card;
};

module.exports = mongoose.model("Card", CardSchema);