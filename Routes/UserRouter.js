const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const AppError = require("../class/errorClass");

const router = express.Router();
router.route("/signup").post(userController.uploadUser, authController.signup);
router.route("/login").post(authController.login);
router.route("/forgot").post(authController.forgotPassword);
router.route("/newPass/:token").patch(authController.newPassword);
router.route("/logout").get(authController.logout);
router
  .route("/updatePass")
  .patch(authController.protect, authController.updateMyPass);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getByUserById
);
router
  .route("/updateMe")
  .patch(
    authController.protect,
    userController.uploadUser,
    userController.updateMe
  );
router
  .route("/")
  .get(userController.getUsers)
  .post(userController.uploadUser, userController.CreateUser);

router
  .route("/:id")
  .get(userController.getByUserById)
  .patch(userController.uploadUser, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
