"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const Term = require("../../../models/data/Term");
const sampleDate = new Date();

const validTerm = {
    id: "0000",
    name: "1970 Winter",
    start_date: sampleDate,
    end_date: sampleDate
};

describe("Term Schema Tests", () => {
    context("calls Term constructor", () => {
        it("should initialize a Term object with empty fields", () => {
            const emptyTerm = new Term();
            Object.keys(emptyTerm.toObject()).forEach(key => {
                if (key !== "_id") {
                    expect(emptyTerm[key]).to.be.undefined();
                }
            });
        });
    });

    context("calls Course.create()", () => {
        it("should initialize a valid Term object", () => {
            const term = Term.create(validTerm);
            expect(term).to.be.an("object");
            expect(term.id).to.equal(validTerm.id);
            expect(term.name).to.equal(validTerm.name);
            expect(term.start_date).to.equal(validTerm.start_date);
            expect(term.end_date).to.equal(validTerm.end_date);
        });
    });
});