"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const Course = require("../../models/Course");
const mongoose = require("mongoose");

const subjectId = mongoose.Types.ObjectId();
const validCourse = {
    id: "1234",
    title: "Course",
    school: "School",
    subject: subjectId,
    attributes: "Attributes",
    requirements: "Requirements"
};
const invalidCourse = {
    id: "1234",
    title: "Course",
    school: "School",
    subject: subjectId,
    attributes: "Attributes"
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
            expect(course.id).to.equal(1234);
            expect(course.title).to.equal("Course");
            expect(course.school).to.equal("School");
            expect(course.subject).to.equal(subjectId);
            expect(course.attributes).to.equal("Attributes");
            expect(course.requirements).to.equal("Requirements");
            expect(course.custom).to.not.be.undefined();
            expect(course.custom).to.be.true();
        });

        it("should initialize a valid Course object and set the 'custom' field when unspecified", () => {
            const course = Course.create(validCourse);
            expect(course).to.be.an("object");
            expect(course.id).to.equal(1234);
            expect(course.title).to.equal("Course");
            expect(course.school).to.equal("School");
            expect(course.subject).to.equal(subjectId);
            expect(course.attributes).to.equal("Attributes");
            expect(course.requirements).to.equal("Requirements");
            expect(course.custom).to.not.be.undefined();
            expect(course.custom).to.be.false();
        });

        it("should throw an exception when an invalid object is passed", () => {
            expect(() => {Course.create(invalidCourse);}).to.throw();
        });
    });
});