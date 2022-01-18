const multer = require("multer");
const upload = multer({
  // dest:"AVATARS",
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(".(jpg|jpeg|png)$")) {
      return cb(new Error("File must be an image!"), false);
    }
    cb(undefined, true);
  },
});

module.exports = upload;
