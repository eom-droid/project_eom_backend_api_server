import express from "express";

import * as diaryController from "../controllers/diary_controller";

import { multiPart } from "../middlewares/file_upload_middleware";
import { body, param, query } from "express-validator";
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
  diaryController.getDiaries
);

diaryRouter.get(
  "/:id",
  express.json(),
  param("id").isString(),
  diaryController.getDiary
);
// diaryRouter.get("/dateFilterTest", express.json(), diaryController.test);

diaryRouter.post(
  "/",
  // milddleware
  multiPart,
  diaryController.createNewDiary
);
