const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    symbol: String,
    name: String
});

module.exports = mongoose.model("Subject", SubjectSchema);