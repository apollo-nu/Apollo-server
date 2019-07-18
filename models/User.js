"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
    email: String,
    password: String
});

function generateHash(password) {
    return bcryptjs.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validateUser = function(password) {
    return bcryptjs.compareSync(password, this.password);
};

UserSchema.statics.create = function(obj) {
    let user = new mongoose.model("User", UserSchema)();
    if (!obj.email) {
        throw new Error("Invalid User Object: Email Missing");
    } else if (!obj.password) {
        throw new Error("Invalid User Object: Password Missing");
    }
    user.email = obj.email;
    user.password = generateHash(obj.password);
    return user;
};

module.exports = mongoose.model("User", UserSchema);