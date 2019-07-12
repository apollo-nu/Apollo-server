"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    course: {type: Schema.Types.ObjectId, ref: "Course"}
});

CardSchema.statics.create = function(obj) {
    let card = new mongoose.model("Card", CardSchema)();
    
    return card;
};

module.exports = mongoose.model("Card", CardSchema);