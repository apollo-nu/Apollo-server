const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// time/date/location/professor info if available (make new schema?)
const CourseSchema = new Schema({
    id: Number,
    title: String,
    school: String,
    subject: String,
    attributes: String,
    requirements: String
});

module.exports = mongoose.model("Course", CourseSchema);