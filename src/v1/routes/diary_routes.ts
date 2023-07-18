import express from "express";

import * as diaryController from "../controllers/diary_controller";

import { multerMiddleware } from "../middlewares/multer_middleware";
import { diaryDetailParamValidation } from "../middlewares/diary/detail_param_middleware";
import { diaryQueryValidation } from "../middlewares/diary/query_middleware";
import { diaryBodyValidation } from "../middlewares/diary/body_middleware";
import { validate } from "../middlewares/validate_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import {
  checkIdExistMiddleware,
  checkPostDTExistMiddleware,
} from "../middlewares/check_id_exist_middleware";
import { DiaryModel } from "../models/diary_model";
import { DIARY } from "../../constant/default";
import { authCheck } from "../middlewares/authenticate_middleware";
import { diarySearchQueryValidation } from "../middlewares/diary/search_query_middleware";
// const authenticate = require("../../middlewares/authenticate");
// const authorize = require("../../middlewares/authorize");

export const diaryRouter = express.Router();

/**
 * @GET /api/v1/diaries
 * @DESC get all diaries
 */
// 아래의 post 경우에는 multipart/form-data로 진행되기 때문에
// get에만 express.json() 미들웨어를 장착!
diaryRouter.get(
  "/",
  authCheck,
  validate(diaryQueryValidation),
  diaryController.getDiaries
);

/**
 * @GET /api/v1/diaries/{id}/detail
 * @DESC get diary detail
 */
diaryRouter.get(
  "/:id/detail",
  authCheck,
  validate(diaryDetailParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.getDiary
);

/**
 * @GET /api/v1/diaries/search
 * @DESC search diary with postDT
 */
diaryRouter.get(
  "/search",
  authCheck,
  validate(diarySearchQueryValidation),
  checkPostDTExistMiddleware(DiaryModel)
);

// 1. authCheck로 token 인증
// 2. multerInstance로 multipart 자르고 -> buffer에 넣어두기
// 3. nestedBodyParser로 nested body를 flat하게 만들고
// 4. validate로 body validation
diaryRouter.post(
  "/",
  authCheck,
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
  authCheck,
  multerMiddleware,
  nestedBodyParser(DIARY),
  validate(diaryBodyValidation.concat(diaryDetailParamValidation)),
  checkIdExistMiddleware(DiaryModel),
  diaryController.updateDiary
);

diaryRouter.delete(
  "/:id",
  authCheck,
  validate(diaryDetailParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.deleteDiary
);
