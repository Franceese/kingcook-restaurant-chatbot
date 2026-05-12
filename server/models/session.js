const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1
  }
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,

  currentOrder: [orderSchema],

  orderHistory: [
    {
      items: [orderSchema],
      totalAmount: Number,
      status: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Session", sessionSchema);