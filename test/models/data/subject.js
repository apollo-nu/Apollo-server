"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const Subject = require("../../../models/data/Subject");

const validSubject = {
    symbol: "AAA",
    name: "Subject"
};
const invalidSubjectWithoutSymbol = {
    name: "Subject"
};
const invalidSubjectWithoutName = {
    symbol: "AAA"
};

describe("Subject Schema Tests", () => {
    context("calls Subject constructor", () => {
        it("should initialize a Subject object with empty fields", () => {
            const emptySubject = new Subject();
            Object.keys(emptySubject.toObject()).forEach(key => {
                if (key !== "_id") {
                    expect(emptySubject[key]).to.be.undefined();
                }
            });
        });
    });

    context("calls Subject.create()", () => {
        it("should initialize a valid Subject object", () => {
            const subject = Subject.create(validSubject, true);
            expect(subject).to.be.an("object");
            expect(subject.symbol).to.equal("AAA");
            expect(subject.name).to.equal("Subject");
            expect(subject.custom).to.not.be.undefined();
            expect(subject.custom).to.be.true();
        });

        it("should initialize a valid Subject object and set the 'custom' field when unspecified", () => {
            const subject = Subject.create(validSubject);
            expect(subject).to.be.an("object");
            expect(subject.symbol).to.equal("AAA");
            expect(subject.name).to.equal("Subject");
            expect(subject.custom).to.not.be.undefined();
            expect(subject.custom).to.be.false();
        });

        it("should throw an exception when an invalid object is passed", () => {
            expect(() => {Subject.create(invalidSubjectWithoutSymbol);}).to.throw();
            expect(() => {Subject.create(invalidSubjectWithoutName);}).to.throw();
        });
    });
});