import express from "express";

export const authRouter = express.Router();

import { validate } from "../middlewares/validate_middleware";
import { joinKakaoBodyValidation } from "../middlewares/auth/kakao_body_middleware";
import * as authController from "../controllers/auth_controller";

/**
 * @POST /api/v1/auth/kakao
 * @DESC join kakao
 */
authRouter.post(
  "/kakao",
  validate(joinKakaoBodyValidation),
  authController.kakao
);

// /**
//  * @POST /api/v1/auth/email/join
//  * @DESC join with eamil
//  */
// authRouter.post(
//   "/email/join",
//   validate(joinKakaoBodyValidation),
//   authController.kakao
// );
