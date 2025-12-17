const { promisify } = require("util");
const User = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const AppError = require("../class/errorClass");
const sendEmail = require("../schemas/email");
const crypto = require("crypto");
const { compare } = require("bcrypt");
const { updateUser } = require("./userController");
const Email = require("../schemas/email");

const signToken = (id) => {
  return jwt.sign(
    { id }, // payload
    process.env.JWT_SECRET, // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN } // expiry time (e.g., "90d")
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",

    secure: false, // for localhost must be false
    // critical for cross-origin navigation from email
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    token,
    status: "success",
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const photoName = req.file ? req.file.filename : "default.jpg";
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: photoName,
  });

  // const Token = signToken(newUser._id);
  const url = `http://localhost:5173`;
  new Email(newUser, url).sendWelcome();
  console.log("Email Sent!");

  createSendToken(newUser, 201, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email or password", 404));
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new AppError("no user in this email", 404));
  }
  const compare = await user.ComparePassword(password, user.password);
  if (!compare) {
    return next(new AppError("incorrect email or password"));
  }
  createSendToken(user, 201, res);
};

exports.protect = async (req, res, next) => {
  console.log("entered to authController");

  let Token;

  if (req.cookies.jwt) {
    Token = req.cookies.jwt;
  }
  console.log(Token);
  if (!Token) {
    return next(
      new AppError("you not a loged in user please login to continue")
    );
  }
  const decoded = await promisify(jwt.verify)(Token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("the user is not exit", 404));
  }
  req.user = user;
  next();
};
exports.protectRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not allowed to access this route", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("no user in this email please check you email"));
  }
  const resteToken = await user.forgotPassToken();
  await user.save({ validateBeforeSave: false });

  //
  const resetURL = `http://localhost:5173/reset-password/${resteToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    // sendEmail({
    //   email: user.email,
    //   subject: "Your password rested token will exprie in 10 minutes",
    //   message: message,
    // });
    await new Email(user, resetURL).sendPasswordReset();
  } catch (err) {
    (user.passwordResetTokenExpire = undefined),
      (user.passwordResetExpires = undefined);
    return next(
      new AppError(
        "something went wrong while sending your Email, please try again later"
      )
    );
  }
  res.status(200).json({
    status: "success",
    resteToken,
  });
};

exports.newPassword = async function (req, res, next) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token);
  console.log(hashedToken);
  const user = await User.findOne({ passwordResetToken: hashedToken });
  if (!user) {
    return next(new AppError("now user found", 404));
  }
  console.log(user);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
};

exports.updateMyPass = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  if (!user) {
    return next(new AppError("cannot fing user", 404));
  }
  const compare = await user.ComparePassword(
    req.body.CurrentPass,
    user.password
  );
  if (!compare) {
    return next(
      new AppError(
        "your current password is not matching your old password",
        404
      )
    );
  }

  (user.password = req.body.newPassword),
    (user.confirmPassword = req.body.confirmPassword);
  (user.passwordResetExpires = undefined),
    (user.passwordResetToken = undefined);
  await user.save();
  createSendToken(user, 201, res);
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};
