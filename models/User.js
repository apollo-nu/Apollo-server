const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
    email: String,
    password: String
});

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validateUser = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.statics.create = function(obj) {
    let user = new mongoose.model("User", UserSchema)();
    user.email = obj.email;
    user.password = generateHash(obj.password);
    return user;
}

module.exports = mongoose.model("User", UserSchema);