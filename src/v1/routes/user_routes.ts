import express from "express";

import { validate } from "../middlewares/validate_middleware";

import * as userController from "../controllers/user_controller";
import { checkAccessTokenValidation } from "../middlewares/check_access_token_middleware";
import { authCheck } from "../middlewares/authenticate_middleware";
import { RoleType } from "../../constant/default";
import { revokeGoogleBodyValidation } from "../middlewares/auth/google_body_middleware";
import { multerMiddleware } from "../middlewares/multer_middleware";
import { nestedBodyParser } from "../../middlewares/nested_body_parser";
import { profilePatchBodyValidation } from "../middlewares/user/profile_patch_body_middleware";
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
  "/me/profile",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  multerMiddleware,
  nestedBodyParser("profile"),
  validate(profilePatchBodyValidation),
  userController.patchProfile
);

// kakao 유저 탈퇴
/**
 * @DELETE /api/v1/user/me/kakao
 * @DESC 카카오 유저 탈퇴
 */
userRouter.delete(
  "/me/kakao",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  userController.deleteKakaoUser
);

//  email 유저 탈퇴
/**
 * @DELETE /api/v1/user/me/email
 * @DESC  email 유저 탈퇴
 */
userRouter.delete(
  "/me/email",
  authCheck({
    role: RoleType.USER,
    userRequire: true,
  }),
  userController.deleteEmailUser
);

// google 유저 탈퇴
/**
 * @DELETE /api/v1/user/me/google
 * @DESC google 유저 탈퇴
 */
userRouter.delete(
  "/me/google",
  validate(revokeGoogleBodyValidation),
  userController.deleteGoogleUser
);

// apple 유저 탈퇴
/**
 * @DELETE /api/v1/user/me/apple
 * @DESC apple 유저 탈퇴
 */
userRouter.delete(
  "/me/apple",
  validate(revokeGoogleBodyValidation),
  userController.deleteAppleUser
);

// logout
/**
 * @POST /api/v1/user/logout
 * @DESC 로그아웃
 */
userRouter.post(
  "/logout",
  authCheck({
    role: RoleType.USER,
  }),
  userController.logout
);
