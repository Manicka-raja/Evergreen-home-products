const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") cb(null, "public/img/user");
    else if (file.fieldname === "image") cb(null, "public/img/products");
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
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
