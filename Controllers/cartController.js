const Cart = require("../schemas/CartSchema");

exports.addToCart = async (req, res) => {
  try {
    const { tour, quantity } = req.body;
    const userId = req.user.id;

    let cartItem = await Cart.findOne({
      user: userId,
      tour: tour,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: userId,
        tour: tour,
        quantity: quantity,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// controllers/cartController.js (Add this to the file)

// ... existing exports.getCart and exports.addToCart

exports.deleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const cartItem = await Cart.findOneAndDelete({
      _id: cartItemId,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "fail",
        message: "No item found with that ID or you lack permission.",
      });
    }

    // Standard response for successful deletion (204 No Content)
    res.status(204).json({
      status: "success",
      data: null, // We send no data back on a 204 response
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const cartItemId = req.params.id;

    if (quantity === undefined || quantity === null || quantity < 1) {
      return res.status(400).json({
        status: "fail",
        message: "Quantity must be a positive number.",
      });
    }

    const cartItem = await Cart.findOneAndUpdate(
      { _id: cartItemId, user: userId },
      { quantity: quantity },
      { new: true, runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        status: "fail",
        message: "No item found with that ID or you lack permission.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cart item updated successfully.",
      data: { cartItem },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ user: userId });

    res.status(200).json({
      status: "success",
      results: cartItems.length,
      data: {
        cartItems,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
