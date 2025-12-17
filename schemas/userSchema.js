const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },

    password: {
      type: String,
      required: [true, " A user must have a password"],
      minLength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "A user must confirm their password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "confirm password does not match password",
      },
    },
    passwordResetToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetTokenExpire: Date,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  console.log("pre save enters");
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// userSchema.virtual("cartItems", {
//   ref: "Cart",
//   foreignField: "user",
//   localField: "_id",
// });
userSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "user", // field in Booking schema
  localField: "_id", // field in User schema
});

userSchema.methods.ComparePassword = async function (
  userPassword,
  currentPassword
) {
  return await bcrypt.compare(userPassword, currentPassword);
};
userSchema.methods.forgotPassToken = function () {
  console.log("enters into fpassToken");
  const randomToken = crypto.randomBytes(16).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return randomToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
