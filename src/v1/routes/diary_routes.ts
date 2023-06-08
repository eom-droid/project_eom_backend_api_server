import express from "express";

import * as diaryController from "../controllers/diary_controller";

import { awsS3UploadMiddleware } from "../middlewares/aws_S3_middleware";
import { body, param, query } from "express-validator";
import { PAGINATE_LIMIT } from "../../constant/default";
import { checkIdMiddleware } from "../middlewares/check_id_middleware";
import { inputMiddleware } from "../middlewares/input_middleware";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

// 아래의 post 경우에는 multipart/form-data로 진행되기 때문에
// get에만 express.json() 미들웨어를 장착!

diaryRouter.get(
  "/",
  express.json(),
  [
    query("count")
      .isInt({ min: 1, max: PAGINATE_LIMIT })
      .optional()
      .toInt()
      .bail(),
    query("category").isString().optional().bail(),
    query("postDateInd").isInt({ min: 0 }).optional().toInt().bail(),
    query("postDT")
      .isString()
      .optional()
      .toDate()
      .custom((value: Date, { req }) => {
        const givenDate = new Date(value);
        const currentDate = new Date();
        if (givenDate > currentDate) {
          throw new Error("postDT should be less than current date");
        }
        return true;
      })
      .bail(),
  ],
  inputMiddleware,
  diaryController.getDiaries
);

diaryRouter.get(
  "/:id",
  param("id").isString(),
  inputMiddleware,
  diaryController.getDiary
);

diaryRouter.post(
  "/",
  // milddleware
  awsS3UploadMiddleware,
  diaryController.createNewDiary
);

diaryRouter.patch(
  "/:id",
  checkIdMiddleware,

  // [
  //   body("title").isString().bail(),
  //   body("writer").isString().bail(),
  //   body("weather").isString().bail(),
  //   body("hashtags").isArray().bail(),
  //   body("postDT").isDate(),
  //   body("postDateInd").isInt({ min: 0 }).bail(),
  //   body("thumbnail").isString().optional().bail(),
  //   body("category").isString().bail(),
  //   body("isShown").isBoolean().bail(),
  //   body("txts").isArray().bail(),
  //   body("imgs").isArray().bail(),
  //   body("vids").isArray().bail(),
  //   body("contentOrder").isArray().bail(),
  // ],
  // inputMiddleware,
  awsS3UploadMiddleware,
  diaryController.updateDiary
);
