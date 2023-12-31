import express from "express";
import * as diaryController from "../controllers/diary_controller";
import { multerMiddleware } from "../middlewares/multer_middleware";
import { idParamValidation } from "../middlewares/id_param_middleware";
import { diaryQueryValidation } from "../middlewares/diary/query_middleware";
import { diaryBodyValidation } from "../middlewares/diary/body_middleware";
import { validate } from "../middlewares/validate_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { checkIdExistMiddleware } from "../middlewares/check_id_exist_middleware";
import { DiaryModel } from "../models/diary_model";
import { DIARY, DataPassType, RoleType } from "../../constant/default";
import { authCheck } from "../middlewares/authenticate_middleware";
import { DiaryCommentModel } from "../models/diary_comment_model";

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
  authCheck({
    role: RoleType.USER,
  }),
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
  // authCheck({
  //   role: RoleType.USER,
  // }),
  validate(idParamValidation),
  // 여기 추후에 변경 필요 불필요 요청인가 생각해보기!!!
  checkIdExistMiddleware(DiaryModel, DataPassType.PARAMS),
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

/**
 * @POST /api/v1/diaries/{id}/like
 * @DESC like diary
 */

diaryRouter.post(
  "/:id/like",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.createDiaryLike
);

/**
 * @DELETE /api/v1/diaries/{id}/like
 * @DESC disLike diary
 */

diaryRouter.delete(
  "/:id/like",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.deleteDiaryLike
);

/**
 * @GET /api/v1/diaries/{id}/comment
 * @DESC get diary comment
 */
diaryRouter.get(
  "/:id/comment",
  // authCheck({
  //   role: RoleType.USER,
  //   userRequire: true,
  // }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.getDiaryComments
);

/**
 * @POST /api/v1/diaries/{id}/comment
 * @DESC create diary comment
 */

diaryRouter.post(
  "/:id/comment",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryModel),
  diaryController.createDiaryComment
);

/**
 * @PATCH /api/v1/diaries/{id}/comment
 * @DESC update diary comment
 */
diaryRouter.patch(
  "/:id/comment",

  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  // 존재여부 확인
  validate(idParamValidation),
  // validate(id),
  // diary의 존재 여부는 중요하지 않음
  checkIdExistMiddleware(DiaryCommentModel, DataPassType.BODY, "commentId"),
  diaryController.updateDiaryComment
);

/**
 * @DELETE /api/v1/diaries/{id}/comment
 * @DESC delete diary comment
 */
diaryRouter.delete(
  "/:id/comment",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  // 존재여부 확인
  validate(idParamValidation),
  // validate(id),
  // diary의 존재 여부는 중요하지 않음
  checkIdExistMiddleware(DiaryCommentModel, DataPassType.BODY, "commentId"),
  diaryController.deleteDiaryComment
);

/**
 * @POST /api/v1/diaries/{diaryId}/comment/{:id}/like
 * @DESC like diary
 */

diaryRouter.post(
  "/:diaryId/comment/:id/like",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("before validate");
    next();
  },
  validate(idParamValidation),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("after validate");
    next();
  },
  checkIdExistMiddleware(DiaryCommentModel),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("after checkIdExistMiddleware");
    next();
  },

  diaryController.createDiaryCommentLike
);

/**
 * @DELETE /api/v1/diaries/{diaryId}/comment/{:id}/like
 * @DESC disLike diary
 */
diaryRouter.delete(
  "/:diaryId/comment/:id/like",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  validate(idParamValidation),
  checkIdExistMiddleware(DiaryCommentModel),
  diaryController.deleteDiaryCommentLike
);
