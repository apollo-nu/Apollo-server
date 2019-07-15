"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    id: Number,
    title: String,
    school: String,
    instructor: String,
    subject: {type: Schema.Types.ObjectId, ref: "Subject"},
    room: String,
    meeting_days: String,
    start_time: String,
    end_time: String,
    // term: {type: Schema.Types.ObjectId, ref: "Term"},
    component: String,
    custom: Boolean
});

CourseSchema.statics.create = function(obj, custom) {
    let course = new mongoose.model("Course", CourseSchema)();
    course.id = obj.id;
    course.title = obj.title;
    course.school = obj.school;
    course.instructor = obj.instructor? obj.instructor.name : null;
    course.subject = obj.subject;
    course.room = obj.room? `${obj.room.building_name} ${obj.room.name}` : null;
    course.meeting_days = obj.meeting_days;
    course.start_time = obj.start_time;
    course.end_time = obj.end_time;
    // course.term = obj.term;
    course.component = obj.component;
    course.custom = custom || false;
    return course;
};

module.exports = mongoose.model("Course", CourseSchema);