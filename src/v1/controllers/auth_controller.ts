import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth_service";

/**
 * @DESC get kakao token
 * @RETURN kakao
 * 오직 rest api만 사용 가능 추후 flutter sdk를 사용하여 진행할 예정
 */
export const kakaoJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;
    const token = await authService.createKakaoUser(code);
    console.log(token);

    return res.status(200).send(token);
  } catch (error: any) {
    // 각 컨트롤러 별 예상가능한 에러에 대해서 종합 필요
    next(error);
  }
};

/**
 * @DESC send verification code
 * 이메일 인증번호 전송 요청
 */

export const sendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.sendVerificationCode(email);
    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC verify email
 * 이메일 인증번호 검증 확인
 */

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verificationCode } = req.body;
    // 다양한 경우에서 실패 시 에러를 던지기 때문에 try catch로 감싸줌
    await authService.verifyEmail(email, verificationCode);
    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC login with email
 * 이메일 활용 회원가입
 */
export const emailJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, nick } = req.body;
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC login with email
 * 이메일 활용 회원가입
 */
export const emailLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error: any) {
    next(error);
  }
};
