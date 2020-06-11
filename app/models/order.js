const mongoose = require("mongoose");
const { Schema } = mongoose;


var orderSchema = new Schema({
    orderId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    subTotal: { type: Number },
    date: { type: Date }
});

module.exports = mongoose.model("order", orderSchema);  