import { Request, Response } from "express";
import * as authService from "../services/auth_service";

/**
 * @DESC get kakao token
 * @RETURN kakao
 * 오직 rest api만 사용 가능 추후 flutter sdk를 사용하여 진행할 예정
 */
export const kakaoJoin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const token = await authService.createKakaoUser(code);
    console.log(token);

    return res.status(200).send(token);
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

/**
 * @DESC send verification code
 * 이메일 인증번호 전송 요청
 */

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.sendVerificationCode(email);
    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

/**
 * @DESC verify email
 * 이메일 인증번호 검증 확인
 */

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

/**
 * @DESC login with email
 * 이메일 활용 회원가입
 */
export const emailJoin = async (req: Request, res: Response) => {
  try {
    const { email, password, nick } = req.body;
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

/**
 * @DESC login with email
 * 이메일 활용 회원가입
 */
export const emailLogin = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.log(new Date().toISOString() + ": npm log: " + error);

    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
