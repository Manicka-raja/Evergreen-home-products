const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const TourRouter = require("./Routes/TourRouter");
const reviewRouter = require("./Routes/ReviewRouter");
const globalError = require("./errorController/errorController");
const AppError = require("./class/errorClass");
const CartRoute = require("./Routes/CartRoute");
const OrderRoute = require("./Routes/OrderRoute");
const BookingRoute = require("./Routes/BookingRoute");
const compression = require("compression");
dotenv.config({ path: "./config.env" });

const userRouter = require("./Routes/UserRouter");
const app = express();
const path = require("path");
app.use("/img/user", express.static(path.join(__dirname, "public/img/user")));
app.use(
  "/img/products",
  express.static(path.join(__dirname, "public/img/products"))
);
3;
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "https://evergreen-frontend-cqzj.onrender.com",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
// app.use((req, res, next) => {
//   console.log("hii iam from middleware");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("hii iam from middleware 2 😂");
//   next();
// });
const DB = process.env.CONNECTION_STRING;
mongoose
  .connect(DB)
  .then(() => console.log("db connected successful"))
  .catch((err) => console.log("there is error in connecting db", err));
console.log(process.env.NODE_ENV);
app.use(compression());
app.use("/api/v1/products", TourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/cart", CartRoute);
app.use("/api/v1/orders", OrderRoute);
app.use("/api/v1/bookings", BookingRoute);
app.use((req, res, next) => {
  next(new AppError(`this route : ${req.originalUrl} is not defined`, 404));
});

app.use(globalError);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is started");
});
