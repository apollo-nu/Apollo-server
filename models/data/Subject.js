"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    symbol: String,
    name: String,
    custom: Boolean
});

SubjectSchema.statics.create = function(obj, custom) {
    let subject = new mongoose.model("Subject", SubjectSchema)();
    if (!obj.symbol) {
        throw new Error("Invalid Subject Object: Symbol Missing");
    } else if (!obj.name) {
        throw new Error("Invalid Subject Object: Name Missing");
    }
    subject.symbol = obj.symbol;
    subject.name = obj.name;
    subject.custom = custom || false;
    return subject;
};

module.exports = mongoose.model("Subject", SubjectSchema);