"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const Course = require("../../../models/data/Course");
const mongoose = require("mongoose");

const subjectId = mongoose.Types.ObjectId();
const termId = mongoose.Types.ObjectId();
const validCourse = {
    id: "1234",
    title: "Course",
    school: "School",
    instructor: {
        name: "Instructor"
    },
    subject: subjectId,
    catalog_num: "214-0",
    room: {
        building_name: "Building",
        name: "Room"
    },
    meeting_days: "MTuWThF",
    start_time: "00:00",
    end_time: "23:59",
    term: termId,
    component: "Component"
};

describe("Course Schema Tests", () => {
    context("calls Course constructor", () => {
        it("should initialize a Course object with empty fields", () => {
            const emptyCourse = new Course();
            Object.keys(emptyCourse.toObject()).forEach(key => {
                if (key !== "_id") {
                    expect(emptyCourse[key]).to.be.undefined();
                }
            });
        });
    });

    context("calls Course.create()", () => {
        it("should initialize a valid Course object", () => {
            const course = Course.create(validCourse, true);
            expect(course).to.be.an("object");
            expect(course.id).to.equal(parseInt(validCourse.id));
            expect(course.title).to.equal(validCourse.title);
            expect(course.school).to.equal(validCourse.school);
            expect(course.instructor).to.equal(validCourse.instructor.name);
            expect(course.subject).to.equal(validCourse.subject);
            expect(course.catalog_num).to.equal(validCourse.catalog_num);
            expect(course.room).to.equal(`${validCourse.room.building_name} ${validCourse.room.name}`);
            expect(course.meeting_days).to.equal(validCourse.meeting_days);
            expect(course.start_time).to.equal(validCourse.start_time);
            expect(course.end_time).to.equal(validCourse.end_time);
            expect(course.term).to.equal(validCourse.term);
            expect(course.component).to.equal(validCourse.component);
            expect(course.custom).to.not.be.undefined();
            expect(course.custom).to.be.true();
        });

        it("should initialize a valid Course object and set the 'custom' field when unspecified", () => {
            const course = Course.create(validCourse);
            expect(course).to.be.an("object");
            expect(course.id).to.equal(parseInt(validCourse.id));
            expect(course.title).to.equal(validCourse.title);
            expect(course.school).to.equal(validCourse.school);
            expect(course.instructor).to.equal(validCourse.instructor.name);
            expect(course.subject).to.equal(validCourse.subject);
            expect(course.catalog_num).to.equal(validCourse.catalog_num);
            expect(course.room).to.equal(`${validCourse.room.building_name} ${validCourse.room.name}`);
            expect(course.meeting_days).to.equal(validCourse.meeting_days);
            expect(course.start_time).to.equal(validCourse.start_time);
            expect(course.end_time).to.equal(validCourse.end_time);
            expect(course.term).to.equal(validCourse.term);
            expect(course.component).to.equal(validCourse.component);
            expect(course.custom).to.not.be.undefined();
            expect(course.custom).to.be.false();
        });
    });
});