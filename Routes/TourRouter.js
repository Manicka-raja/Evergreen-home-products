const express = require("express");
const productController = require("../Controllers/productController");
const authController = require("../Controllers/authController");
const reviewRouter = require("./ReviewRouter");
const router = express.Router();

// router.param("id", (req, res, next, value) => {
//   console.log(`this is your id:${value}`);
//   next();
// });
router.use("/:tourID/reviews", reviewRouter);

router
  .route("/")
  .get(authController.protect, productController.getProducts)
  .post(productController.uploadTour, productController.postProducts);

router
  .route("/:id")
  .get(productController.getById)
  .patch(productController.uploadTour, productController.updateProducts)
  .delete(
    authController.protect,
    authController.protectRoles("admin", "user"),
    productController.deleteProducts
  );

module.exports = router;
