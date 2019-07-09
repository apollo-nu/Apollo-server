const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RowSchema = new Schema({

});

module.exports = mongoose.model("Row", RowSchema);