const Order = require("../schemas/OrderSchema");
const Tour = require("../schemas/tourschema");
const AppError = require("../class/errorClass");

const Razorpay = require("razorpay");
require("dotenv").config({ path: "./config.env" });

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_KEY_SECRET,
});
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    status: "success",
    key: process.env.RAZORPAY_API_KEY,
  });
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) throw new AppError("Tour not found", 404);

    const amount = tour.price * 100;

    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: `tour_${tour.id}`,
    });

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (err) {
    next(err);
  }
};
// Controllers/OrderController.js

exports.createCartOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const order = await instance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `cart_${Date.now()}`, // Generate a unique receipt ID
    });

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (err) {
    next(err);
  }
};
