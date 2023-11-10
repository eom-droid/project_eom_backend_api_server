import express from "express";

export const authRouter = express.Router();

import { validate } from "../middlewares/validate_middleware";
import { joinKakaoBodyValidation } from "../middlewares/auth/join_kakao_body_middleware";
import { joinEmailBodyValidation } from "../middlewares/auth/join_email_body_middleware";
import { loginEmailBodyValidation } from "../middlewares/auth/login_email_body_middleware";
import * as authController from "../controllers/auth_controller";
import { joinEmailVerifyBodyValidation } from "../middlewares/auth/join_email_verify_body_middleware";
import { joinEmailVerificationCodeSendBodyValdiation } from "../middlewares/auth/join_email_verificationCode_send_body_middleware";

/**
 * @POST /api/v1/auth/join/email/verify
 * @DESC 인증번호 검증 확인
 */

authRouter.post(
  "/join/email/verify",
  validate(joinEmailVerifyBodyValidation),
  authController.verifyEmail
);

/**
 * @POST /api/v1/auth/join/email/verificationCode/send
 * @DESC 이메일 인증번호 전송 요청
 */

authRouter.post(
  "/join/email/verificationCode/send",
  validate(joinEmailVerificationCodeSendBodyValdiation),
  authController.sendVerificationCode
);

/**
 * @POST /api/v1/auth/join/email
 * @DESC join with email
 */
authRouter.post(
  "/join/email",
  validate(joinEmailBodyValidation),
  authController.emailJoin
);

/**
 * @POST /api/v1/auth/login
 * @DESC login with email
 */
authRouter.post(
  "/login/email",
  validate(loginEmailBodyValidation),
  authController.emailLogin
);

/**
 * @GET /api/v1/auth/email/access-token
 * @DESC access token 발급
 */

authRouter.get("/access-token", authController.getAccessToken);

/**
 * @POST /api/v1/auth/kakao
 * @DESC join kakao
 */
authRouter.post(
  "/kakao",
  validate(joinKakaoBodyValidation),
  authController.kakaoJoin
);
