const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "public/img/user");
    } else if (file.fieldname === "image") {
      cb(null, "public/img/products");
    } else {
      cb(new Error("Invalid field name"));
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // safer
    if (file.fieldname === "photo") {
      cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
    } else if (file.fieldname === "image") {
      cb(null, `product-${Date.now()}${ext}`);
    }
  },
});

// allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Not an image file!"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
