const express = require("express");
const orderController = require("../Controllers/OrderController");
const authController = require("../Controllers/authController");

const router = express.Router();

// Protect the route to get req.user

router
  .route("/checkout-session/:id")
  .post(authController.protect, orderController.createCheckoutSession);
router.get(
  "/razorpay-key",
  authController.protect,
  orderController.getRazorpayKey
);
router.post(
  "/checkout-cart",
  authController.protect,
  orderController.createCartOrder
);
module.exports = router;
