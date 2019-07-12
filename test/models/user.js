"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const User = require("../../models/User");

describe("#User() Constructor", () => {
    context("without arguments", () => {
        it("should return a User object with empty fields", () => {
            const emptyUser = new User();
            expect(emptyUser.email).to.be.undefined();
            expect(emptyUser.password).to.be.undefined();
            expect(emptyUser.board).to.be.undefined();
        });
    });
});