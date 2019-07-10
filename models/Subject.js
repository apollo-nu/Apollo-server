const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    custom: Boolean,
    symbol: String,
    name: String
});

SubjectSchema.statics.create = function(obj, custom) {
    let subject = new mongoose.model("Subject", SubjectSchema)();
    subject.custom = custom;
    subject.symbol = obj.symbol;
    subject.name = obj.name;
    return subject;
}

module.exports = mongoose.model("Subject", SubjectSchema);