const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    custom: Boolean,
    symbol: String,
    name: String
});

SubjectSchema.methods.initialize = function(subjectObject, custom) {
    this.custom = custom;
    this.symbol = subjectObject.symbol;
    this.name = subjectObject.name;
}

module.exports = mongoose.model("Subject", SubjectSchema);