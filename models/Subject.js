"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    symbol: String,
    name: String,
    custom: Boolean
});

SubjectSchema.statics.create = function(obj, custom) {
    let subject = new mongoose.model("Subject", SubjectSchema)();
    subject.custom = custom;
    subject.symbol = obj.symbol;
    subject.name = obj.name;
    return subject;
}

module.exports = mongoose.model("Subject", SubjectSchema);