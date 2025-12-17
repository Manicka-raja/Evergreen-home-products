const qs = require("qs");
const Apifeauter = require("../class/Apifeature");
const Tour = require("../schemas/tourschema");
const AppError = require("../class/errorClass");
const upload = require("../schemas/multer");

exports.uploadTour = upload.single("image");
exports.getProducts = async (req, res) => {
  const parsedQuery = qs.parse(req.query, { allowDots: true });
  const features = new Apifeauter(Tour.find(), parsedQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
  if (!tours) next(new AppError("there is no Produts to display", 404));

  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
};

exports.postProducts = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const tour = await Tour.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("reviews");
    if (!tour) {
      return next(new AppError("no product in this specific id", 404));
    }
    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateProducts = async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.filename;
  }
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(new AppError("no tour in this specific id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteProducts = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
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
      new AppError("you are only allowed to edit name and email", 403)
    );
  }
  const filteredBody = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.body.email) filteredBody.email = req.body.email;
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
