import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const allowedExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;

    const hasValidMime = file.mimetype.startsWith("image/");
    const hasValidExtension = allowedExtensions.test(file.originalname);

    if (hasValidMime || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});
