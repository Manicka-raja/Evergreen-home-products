const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "A tour must have a review"],
  },
  rating: {
    type: String,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "A review must belong to a tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A review must belong to a user"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({
    path: "tour",
    select: "name image",
    options: { skipGuides: true },
  });
  next();
});
const review = mongoose.model("Review", reviewSchema);
module.exports = review;
