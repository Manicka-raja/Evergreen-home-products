const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },

  tours: [
    {
      tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Booking must have a tour!"],
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String },
  paymentStatus: { type: String, default: "pending" },
  paidAt: { type: Date },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email photo",
  }).populate({
    path: "tours.tour",
    select: "name price image",
  });

  next();
});
module.exports = mongoose.model("Booking", bookingSchema);
