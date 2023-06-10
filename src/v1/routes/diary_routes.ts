import express from "express";

import * as diaryController from "../controllers/diary_controller";

import { multerMiddleware } from "../middlewares/multer_middleware";
import { diaryParamValidation } from "../middlewares/diary/param_middleware";
import { diaryQueryValidation } from "../middlewares/diary/query_middleware";
import { diaryBodyValidation } from "../middlewares/diary/body_middleware";
import { validate } from "../middlewares/validate_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { checkIdExistMiddleware } from "../middlewares/check_id_exist_middleware";
import { DiaryModel } from "../models/diary_model";
import { DIARY } from "../../constant/default";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

// 아래의 post 경우에는 multipart/form-data로 진행되기 때문에
// get에만 express.json() 미들웨어를 장착!

diaryRouter.get(
  "/",
  // authCheck,
  validate(diaryQueryValidation),
  diaryController.getDiaries
);

diaryRouter.get(
  "/:id",
  // authCheck,
  validate(diaryParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.getDiary
);

// 1. authCheck로 token 인증
// 2. multerInstance로 multipart 자르고 -> buffer에 넣어두기
// 3. nestedBodyParser로 nested body를 flat하게 만들고
// 4. validate로 body validation
diaryRouter.post(
  "/",
  // authCheck,
  multerMiddleware,
  nestedBodyParser("diary"),
  validate(diaryBodyValidation),
  diaryController.createNewDiary
);

// 1. authCheck로 token 인증
// 2. multerInstance로 multipart 자르고 -> File buffer에 넣어두기
// 3. nestedBodyParser로 nested body를 flat하게 만들고
// 4. validate로 body & params validation
// 5. checkIdExistMiddleware로 patch 할 diary id가 존재하는지 확인
diaryRouter.patch(
  "/:id",
  // authCheck,
  multerMiddleware,
  nestedBodyParser(DIARY),
  validate(diaryBodyValidation.concat(diaryParamValidation)),
  checkIdExistMiddleware(DiaryModel),
  diaryController.updateDiary
);
