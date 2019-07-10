const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
    email: String,
    password: String
});

UserSchema.methods.generateHash = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validateUser = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);