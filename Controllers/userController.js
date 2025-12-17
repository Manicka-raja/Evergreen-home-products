const User = require("../schemas/userSchema");
const express = require("express");
const multer = require("multer");
const upload = require("../schemas/multer");
// Middleware to handle single file upload
exports.uploadUser = upload.single("photo");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

exports.CreateUser = async (req, res, next) => {
  try {
    const photoName = req.file ? req.file.filename : "default.jpg";

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      photo: photoName,
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
exports.getByUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("bookings");
    if (!user) {
      return next(new AppError("no user in this specific id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const updateUser = { ...req.body };
    if (req.file) {
      updateUser.photo = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateUser, {
      new: true,
      runValidators: true,
    });

    if (!User) {
      return next(new AppError("no tour in this specific id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
};
exports.updateMe = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  if (req.body.password || req.body.confirmPassword || req.body.role) {
    return next(
      new AppError("you are only allowed to edit name and email", 404)
    );
  }
  const filteredBody = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.body.email) filteredBody.email = req.body.email;
  if (req.file) filteredBody.photo = req.file.filename;
  const Updateuser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      Updateuser,
    },
  });
};
