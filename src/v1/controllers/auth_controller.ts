import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth_service";
import jwt from "jsonwebtoken";
import { AuthUtils } from "../../utils/auth_utils";
import { TokenType } from "../../constant/default";

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
    const user = await authService.createKakaoUser(code);
    const accessToken = await AuthUtils.createJwt(
      user!._id.toString(),
      TokenType.ACCESS
    );
    const refreshToken = await AuthUtils.createJwt(
      user!._id.toString(),
      TokenType.REFRESH
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken });
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
    if (!(await authService.checkEmailDuplicate(email))) {
      await authService.sendVerificationCode(email);
      return res.status(200).send({ status: "SUCCESS" });
    } else {
      throw { status: 400, message: "이미 가입된 이메일입니다." };
    }
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
    const { email, password, verificationCode } = req.body;
    // 1. verificationCode 검증
    // 1번 이유 : 해당 url로 요청이 온경우 이메일 중복 여부부터 확인하는 경우, 해당 이메일의 회원가입 여부를 알 수 있기 때문에
    await authService.verifyEmail(email, verificationCode);
    // 2, email 중복 여부 확인
    if (await authService.checkEmailDuplicate(email)) {
      throw { status: 400, message: "이미 가입된 이메일입니다." };
    }

    // 3. 회원가입(사용자 생성)
    const user = await authService.createEmailUser(email, password);
    // 4. 토큰 생성
    const accessToken = await AuthUtils.createJwt(
      user!._id.toString(),
      TokenType.ACCESS
    );
    const refreshToken = await AuthUtils.createJwt(
      user!._id.toString(),
      TokenType.REFRESH
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken });
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
    const { email, password } = req.body;

    // const token = await authService.verifyToken(refreshToken);
  } catch (error: any) {
    next(error);
  }
};
