import multer from "multer";
import fs from "fs";
import { BadRequestError } from "../errors/BadRequestError";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest: string =
      file.fieldname === "thumbnail" || file.fieldname === "newThumbnail"
        ? "uploads/article/thumbnails"
        : file.fieldname === "image" || file.fieldname === "newImage"
          ? "uploads/article/images"
          : `uploads/others/${file.fieldname}`;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    let replacedTitle = "";
    const title = req.body.title;
    const currentDate = new Date();
    const stringCurrentDate = currentDate.toISOString();
    if (!title) {
      cb(
        new BadRequestError("Place Form Data Title before Thumbnail File"),
        ""
      );
    } else {
      replacedTitle = title.replace(/\s+/g, "-");
    }
    if (file.fieldname === "thumbnail" || file.fieldname === "newThumbnail") {
      cb(
        null,
        file.fieldname +
          "_" +
          replacedTitle +
          "_" +
          stringCurrentDate +
          file.mimetype.replace("image/", ".")
      );
    }
    // if (file.fieldname === "image" || file.fieldname === "newImage")
    else {
      const originalname = file.originalname;
      const replacedOriginalName = originalname.replace(/\s+/g, "-");
      cb(
        null,
        "image_" +
          replacedTitle +
          "_" +
          stringCurrentDate +
          "_" +
          replacedOriginalName
      );
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
