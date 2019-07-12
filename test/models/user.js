"use strict";

const chai = require("chai");
const dirtyChai = require("dirty-chai");
const expect = chai.expect;
chai.use(dirtyChai);

const User = require("../../models/User");

const EMAIL = "email123@gmail.com";
const PASSWORD = "password";
const BAD_PASSWORD = "password123";
const validUserObj = {
    email: EMAIL,
    password: PASSWORD
};
const invalidUserObjEmail = {
    email: EMAIL
};
const invalidUserObjPassword = {
    password: PASSWORD
};

describe("User Schema Tests", () => {
    context("calls User constructor", () => {
        it("should initialize a User object with empty fields", () => {
            const emptyUser = new User();
            expect(emptyUser.email).to.be.undefined();
            expect(emptyUser.password).to.be.undefined();
            expect(emptyUser.board).to.be.undefined();
        });
    });

    context("calls User.create()", () => {
        it("should initialize a valid User object", () => {
            const user = User.create(validUserObj);
            expect(user).to.be.an("object");
            expect(user.email).to.be.a("string");
            expect(user.email).to.equal(EMAIL);
            expect(user.password).to.be.a("string");
            expect(user.board).to.be.undefined();
        });

        it("should throw an exception when an invalid object is passed into the constructor", () => {
            expect(() => {User.create(invalidUserObjEmail);}).to.throw();
            expect(() => {User.create(invalidUserObjPassword);}).to.throw();
        });
    });

    context("calls generateHash()", () => {
        it("should store a hash of a user's password when create() is called", () => {
            const user = User.create(validUserObj);
            expect(user).to.be.an("object");
            expect(user.password).to.be.a("string");
            expect(user.password).to.not.equal(PASSWORD);
        });
    });

    context("calls validateUser()", () => {
        it("should return true when passed the correct password", () => {
            const user = User.create(validUserObj);
            expect(user.validateUser(PASSWORD)).to.be.true();
        });
        
        it("should return false when passed an incorrect password", () => {
            const user = User.create(validUserObj);
            expect(user.validateUser(BAD_PASSWORD)).to.be.false();
        });
    });
});