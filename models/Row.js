const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RowSchema = new Schema({
    quarter: String,
    year: String,
    cards: [{type: Schema.Types.ObjectId, ref: "Card"}]
});

RowSchema.statics.create = function(obj) {
    let row = new mongoose.model("Row", RowSchema)();
    
    return row;
}

module.exports = mongoose.model("Row", RowSchema);