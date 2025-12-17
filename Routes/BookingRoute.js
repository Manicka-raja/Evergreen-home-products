const express = require("express");
const bookingController = require("../Controllers/bookingController");
const authController = require("../Controllers/authController");

const router = express.Router();

// 👇 THIS IS THE ROUTE THAT WAS MISSING
router.post(
  "/create-booking",
  authController.protect,
  bookingController.createBooking
);

module.exports = router;
