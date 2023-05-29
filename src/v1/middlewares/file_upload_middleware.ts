import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { DataUtils } from "../../utils/data_util";
import { STATUS_CODES } from "http";
import { NextFunction, Request, Response } from "express";

const S3Instance = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export const multer_instance = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.originalname.endsWith(".jpg") ||
      file.originalname.endsWith(".png") ||
      file.originalname.endsWith(".jpeg") ||
      file.originalname.endsWith(".gif") ||
      file.originalname.endsWith(".bmp") ||
      file.originalname.endsWith(".JPG") ||
      file.originalname.endsWith(".PNG") ||
      file.originalname.endsWith(".JPEG") ||
      file.originalname.endsWith(".GIF") ||
      file.originalname.endsWith(".BMP")
    ) {
      cb(null, true);
    } else {
      cb(new Error("only image file is allowed"));
    }
  },
  storage: multerS3({
    s3: S3Instance,
    bucket: process.env.S3_BUCKET_NAME!,

    key: function (req, file, cb) {
      const directory = "eom/diary/image/";
      const fileExtension = file.originalname.split(".").pop();

      const fileName =
        directory + DataUtils.generateFileName() + "." + fileExtension;

      cb(null, fileName);
    },
  }),
}).array("file");

export const multiPart = (req: Request, res: Response, next: NextFunction) => {
  multer_instance(req, res, (errorMes) => {
    if (errorMes) {
      res.status(400).send({ status: "FAILED", data: { error: errorMes } });
      return;
    } else {
      next();
    }
  });
};
