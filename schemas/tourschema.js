const mongoose = require("mongoose");

const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A food item must have a name"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "A food item must have a category"], // e.g., Pizza, Burger, Drinks
    },
    price: {
      type: Number,
      required: [true, "A food item must have a price"],
    },
    description: {
      type: String,
      required: [true, "A food item must have a description"],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: [true, "A food item must have an image"],
    },
    gallery: [String],
    spicyLevel: {
      type: Number,
    },
    preparationTime: {
      type: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    location: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        description: String,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User", // similar to guides in tour
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourschema.pre(/^find/, function (next) {
  if (this.options.skipGuides) return next(); // skip populate for reviews

  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  });

  next();
});

tourschema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

const Tour = mongoose.model("Tour", tourschema);

module.exports = Tour;
