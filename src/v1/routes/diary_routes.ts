import express from "express";

import * as diaryController from "../controllers/diary_controller";

import { multiPart } from "../middlewares/file_upload_middleware";
import { body } from "express-validator";
import { PAGINATE_LIMIT } from "../../constant/default";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

// 아래의 post 경우에는 multipart/form-data로 진행되기 때문에
// get에만 express.json() 미들웨어를 장착!

diaryRouter.get(
  "/",
  express.json(),
  [
    body("count").isInt({ min: 1, max: PAGINATE_LIMIT }).optional().bail(),
    body("category").isString().optional().bail(),
    body("after.postDateInd").isInt({ min: 0 }).optional().bail(),
    body("after.postDT")
      .isDate()
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
  diaryController.getDiaries
);
// diaryRouter.get("/dateFilterTest", express.json(), diaryController.test);

diaryRouter.post(
  "/",
  // milddleware
  multiPart,
  diaryController.createNewDiary
);
