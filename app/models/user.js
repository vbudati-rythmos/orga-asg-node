const mongoose = require("mongoose");
const { Schema } = mongoose;


var userSchema = new Schema({
    name: { type: String },
    noOfOrders: { type: Number, default: 0 },
});

module.exports = mongoose.model("user", userSchema);  