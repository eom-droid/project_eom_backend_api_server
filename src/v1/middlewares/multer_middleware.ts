import multer from "multer";
import { DataUtils } from "../../utils/data_util";

export const multerMiddleware = multer({
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      DataUtils.isImageFile(file.originalname) ||
      DataUtils.isVideoFile(file.originalname)
    ) {
      cb(null, true);
    } else {
      cb(new Error("only image/vid file is allowed"));
    }
  },
}).array("file");
