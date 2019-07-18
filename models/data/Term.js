"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TermSchema = new Schema({
    id: String,
    name: String,
    start_date: Date,
    end_date: Date
});

TermSchema.statics.create = function(obj) {
    let term = new mongoose.model("Term", TermSchema)();
    if (!(obj.id && obj.name && obj.start_date && obj.end_date)) {
        throw new Error("Invalid Term Object: One or More Fields Missing");
    }
    term.id = obj.id;
    term.name = obj.name;
    term.start_date = obj.start_date;
    term.end_date = obj.end_date;
    return term;
};

module.exports = mongoose.model("Term", TermSchema);