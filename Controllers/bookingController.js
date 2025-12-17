// Controllers/bookingController.js
const Booking = require("../schemas/OrderSchema");
exports.createBooking = async (req, res, next) => {
  try {
    console.log("🔥 1. HIT: Create Booking Controller Reached!");
    console.log("📦 2. Data Received:", req.body); // Check if frontend sent data

    const { items, totalAmount, paymentInfo } = req.body;

    // Validate User
    if (!req.user) {
      console.log("❌ User not found in request (Auth failed)");
      return next(new AppError("User not logged in", 401));
    }

    const bookingData = {
      user: req.user.id,
      tours: items.map((item) => ({
        tour: item.tour,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      paymentInfo,
      paidAt: Date.now(),
    };

    console.log("💾 3. Trying to save this to DB:", bookingData);

    const newBooking = await Booking.create(bookingData);

    console.log("✅ 4. SUCCESS: Booking Saved with ID:", newBooking._id);

    res.status(201).json({
      status: "success",
      data: newBooking,
    });
  } catch (err) {
    console.error("❌ DB SAVE ERROR:", err); // <--- LOOK AT THIS LOG IN YOUR TERMINAL
    next(err);
  }
};
