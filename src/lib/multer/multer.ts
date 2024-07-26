import path from "path";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    const originalName = encodeURIComponent(
      path.parse(file.originalname).name
    ).replace(/[^a-zA-Z0-9]/g, "");
    const timestamp = Date.now();

    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, originalName + timestamp + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(
        new Error("Please upload an image with extension jpg, jpeg or png")
      );
    }
    callback(null, true);
  },
});
export const multerUploader = { upload };
