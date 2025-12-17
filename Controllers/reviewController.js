const review = require("../schemas/reviewSchema");

exports.getReview = async (req, res) => {
  const reviews = await review.find();
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
};
exports.postReview = async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourID;
    if (!req.body.user) req.body.user = req.user.id;
    const reviews = await review.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviews = await review.findByIdAndDelete(req.params.id);

    if (!reviews) {
      return res.status(404).json({
        status: "fail",
        message: "No review found with this ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
