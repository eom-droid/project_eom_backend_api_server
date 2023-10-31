import multer from "multer";
import { DataUtils } from "../../utils/data_util";

/**
 * @DESC multer middleware
 * Multipart/form-data로 전송된 파일을 받아서 body와 file을 분리함
 * file은 req.files에 저장됨
 * body는 req.body에 저장됨
 */
export const multerMiddleware = multer({
  fileFilter: (req, file, cb) => {
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
