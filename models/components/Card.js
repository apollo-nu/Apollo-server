"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    row: {type: Schema.Types.ObjectId, ref: "Row"},
    course: {type: Schema.Types.ObjectId, ref: "Course"}
});

CardSchema.statics.create = function(obj) {
    let card = new mongoose.model("Card", CardSchema)();
    card.user = obj.user;
    card.row = obj.row;
    card.course = obj.course;
    return card;
};

module.exports = mongoose.model("Card", CardSchema);