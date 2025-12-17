const express = require("express");
const cartController = require("../Controllers/cartController");
const authController = require("../Controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, cartController.getCart)
  .post(authController.protect, cartController.addToCart);
router
  .route("/:id")
  .patch(authController.protect, cartController.updateCartItem)
  .delete(authController.protect, cartController.deleteCartItem);
module.exports = router;
