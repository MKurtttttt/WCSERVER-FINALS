import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"));
  }
}

export const upload = multer({ storage, fileFilter });


