import express from "express";

import { validate } from "../middlewares/validate_middleware";

import * as userController from "../controllers/user_controller";
import { checkAccessTokenValidation } from "../middlewares/check_access_token_middleware";
import { authCheck } from "../middlewares/authenticate_middleware";
import { RoleType } from "../../constant/default";
export const userRouter = express.Router();

/**
 * @POST /api/v1/user/me
 * @DESC 인증번호 검증 확인
 */

userRouter.get(
  "/me",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  userController.getMyInfo
);

/**
 * @PATCH /api/v1/user/update/nickname
 * @DESC 닉네임 변경
 */

userRouter.patch(
  "/me/nickname",
  authCheck({
    role: RoleType.USER,
  }),
  userController.updateNickname
);

// 유저 탈퇴
/**
 * @DELETE /api/v1/user/me
 * @DESC 유저 탈퇴
 */
userRouter.delete(
  "/me",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  userController.deleteUser
);