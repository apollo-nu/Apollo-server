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

CourseSchema.statics.create = function(obj, custom) {
    let course = new mongoose.model("Course", CourseSchema)();
    course.custom = custom;
    course.id = obj.id;
    course.title = obj.title;
    course.school = obj.school;
    course.subject = obj.subject;
    course.attributes = obj.attributes;
    course.requirements = obj.requirements;
    return course;
}

module.exports = mongoose.model("Course", CourseSchema);