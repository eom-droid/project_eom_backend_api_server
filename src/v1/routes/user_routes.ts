import express from "express";

import { validate } from "../middlewares/validate_middleware";

import * as userController from "../controllers/user_controller";
import { checkAccessTokenValidation } from "../middlewares/check_access_token_middleware";
export const userRouter = express.Router();

/**
 * @POST /api/v1/user/me
 * @DESC 인증번호 검증 확인
 */

userRouter.get(
  "/me",
  // 이거 나중에 authCheck로 바꿀거임
  validate(checkAccessTokenValidation),
  userController.getMyInfo
);
