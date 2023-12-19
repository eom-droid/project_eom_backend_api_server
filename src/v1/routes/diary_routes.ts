import express from "express";
import * as diaryController from "../controllers/diary_controller";
import { multerMiddleware } from "../middlewares/multer_middleware";
import { idParamValidation } from "../middlewares/detail_param_middleware";
import { diaryQueryValidation } from "../middlewares/diary/query_middleware";
import { diaryBodyValidation } from "../middlewares/diary/body_middleware";
import { validate } from "../middlewares/validate_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { checkIdExistMiddleware } from "../middlewares/check_id_exist_middleware";
import { DiaryModel } from "../models/diary_model";
import { DIARY, RoleType } from "../../constant/default";
import { authCheck } from "../middlewares/authenticate_middleware";

export const diaryRouter = express.Router();

/**
 * @GET /api/v1/diaries
 * @DESC get all diaries
 * @RETURN diaries(diaryModel[])
 */
// 아래의 post 경우에는 multipart/form-data로 진행되기 때문에
// get에만 express.json() 미들웨어를 장착!
diaryRouter.get(
  "/",
  // authCheck({
  //   role: RoleType.USER,
  // }),
  validate(diaryQueryValidation),
  diaryController.getDiaries
);

/**
 * @GET /api/v1/diaries/{id}/detail
 * @DESC get diary detail
 * @RETURN diaryDetail
 */
diaryRouter.get(
  "/:id/detail",
  authCheck({
    role: RoleType.USER,
  }),
  validate(idParamValidation),
  // 여기 추후에 변경 필요 불필요 요청인가 생각해보기!!!
  checkIdExistMiddleware(DiaryModel),
  diaryController.getDiary
);

/**
 * @POST /api/v1/diaries
 * @DESC create new diary
 * @RETURN diary
 */
// 1. authCheck로 token 인증
// 2. multerInstance로 multipart 자르고 -> buffer에 넣어두기
// 3. nestedBodyParser로 nested body를 flat하게 만들고
// 4. validate로 body validation
diaryRouter.post(
  "/",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  multerMiddleware,
  nestedBodyParser(DIARY),
  validate(diaryBodyValidation),
  diaryController.createNewDiary
);

/**
 * @PATCH /api/v1/diaries/{id}
 * @DESC update diary
 */
// 1. authCheck로 token 인증
// 2. multerInstance로 multipart 자르고 -> File buffer에 넣어두기
// 3. nestedBodyParser로 nested body를 flat하게 만들고
// 4. validate로 body & params validation
// 5. checkIdExistMiddleware로 patch 할 diary id가 존재하는지 확인
diaryRouter.patch(
  "/:id",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  multerMiddleware,
  nestedBodyParser(DIARY),
  validate(diaryBodyValidation.concat(idParamValidation)),
  checkIdExistMiddleware(DiaryModel),
  diaryController.updateDiary
);

/**
 *
 * @DELETE /api/v1/diaries/{id}
 * @DESC delete diary
 */
diaryRouter.delete(
  "/:id",
  authCheck({
    role: RoleType.ADMIN,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.deleteDiary
);
