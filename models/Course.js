const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// time/date/location/professor info if available (make new schema?)
const CourseSchema = new Schema({
    custom: Boolean,
    id: Number,
    title: String,
    school: String,
    subject: String, //make this an ObjectId reference to Subject
    attributes: String,
    requirements: String
});

CourseSchema.methods.initialize = function(courseObject, custom) {
    this.custom = custom;
    this.id = courseObject.id;
    this.title = courseObject.title;
    this.school = courseObject.school;
    this.subject = courseObject.subject;
    this.attributes = courseObject.attributes;
    this.requirements = courseObject.requirements;
}

module.exports = mongoose.model("Course", CourseSchema);