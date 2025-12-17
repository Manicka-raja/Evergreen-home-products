const express = require("express");
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getReview)
  .post(
    authController.protect,
    authController.protectRoles("user"),
    reviewController.postReview
  );
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
