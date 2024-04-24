import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth_service";
import { AuthUtils } from "../../utils/auth_utils";
import { CookieOption, TokenType } from "../../constant/default";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";

/**
 * @DESC get kakao token
 * @RETURN kakao
 * 오직 rest api만 사용 가능
 */
export const kakaoJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    const userId = (await authService.createKakaoUserByWeb(
      code
    ))!._id.toString();

    const refreshToken: string = await AuthUtils.createRefreshToken(userId);
    const accessToken: string = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
  } catch (error: any) {
    // 각 컨트롤러 별 예상가능한 에러에 대해서 종합 필요
    next(error);
  }
};

/**
 * @DESC get google token
 * @RETURN google
 * 오직 rest api만 사용 가능
 */
export const googleJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    const userId = (
      await authService.getOrCreateGoogleUserByWeb({
        code: decodeURI(code),
      })
    ).user!._id.toString();

    const refreshToken: string = await AuthUtils.createRefreshToken(userId);
    const accessToken: string = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
  } catch (error: any) {
    // 각 컨트롤러 별 예상가능한 에러에 대해서 종합 필요
    next(error);
  }
};

/**
 * @DESC get apple token
 * @RETURN apple
 * 오직 rest api만 사용 가능
 */
export const appleJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;
    console.log(code);

    const userId = (
      await authService.getOrCreateAppleUserByWeb(code)
    ).user!._id.toString();

    const refreshToken: string = await AuthUtils.createRefreshToken(userId);
    const accessToken: string = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
  } catch (error: any) {
    console.log(error);
    // 각 컨트롤러 별 예상가능한 에러에 대해서 종합 필요
    next(error);
  }
};

/**
 * @DESC get kakao token
 * @RETURN token and userData
 * 오직 rest api만 사용 가능 추후 flutter sdk를 사용하여 진행할 예정
 */
export const kakaoJoinByApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    const userId = (await authService.createKakaoUserByApp(
      authorization!
    ))!._id.toString();

    const refreshToken: string = await AuthUtils.createRefreshToken(userId);
    const accessToken: string = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
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
    // 기존에 db에 저장된 이메일이 있는지 확인했지만
    // 이메일 중복 여부를 확인하지 않는것으로 변경
    // if (!(await authService.checkEmailDuplicate(email))) {
    //   await authService.sendVerificationCode(email);
    //   return res.status(200).send({ status: "SUCCESS" });
    // } else {
    //   throw new CustomHttpErrorModel({
    //     status: 400,
    //     message: "이미 가입된 이메일입니다.",
    //   });
    // }
    await authService.sendVerificationCode(email);
    return res.status(200).send({ status: "SUCCESS" });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC reset password
 * 비밀번호 재설정
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, verificationCode } = req.body;
    // 1. verificationCode 검증
    // 1번 이유 : 해당 url로 요청이 온경우 이메일 중복 여부부터 확인하는 경우, 해당 이메일의 회원가입 여부를 알 수 있기 때문에
    await authService.verifyEmail(email, verificationCode);

    // 2. 유저 비밀번호 변경
    const userId = (
      await authService.resetPassword(email, password)
    )._id.toString();

    // 4. 이메일 인증 완료 처리(삭제)
    await authService.deleteEmailVerify(email);
    // 5. 토큰 생성
    const refreshToken = await AuthUtils.createRefreshToken(userId);
    const accessToken = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
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
      throw new CustomHttpErrorModel({
        status: 400,
        message: "이미 가입된 이메일입니다.",
      });
    }

    // 3. 회원가입(사용자 생성)
    const user = await authService.createEmailUser(email, password);
    const userId = user._id.toString();
    // 4. 이메일 인증 완료 처리(삭제)
    await authService.deleteEmailVerify(email);
    // 5. 토큰 생성
    const refreshToken = await AuthUtils.createRefreshToken(userId);
    const accessToken = AuthUtils.createAccessToken(userId);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
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
    // 1. email, password 검증
    const userId = (
      await authService.emailLogin(email, password)
    )._id.toString();
    // 2. 토큰 생성
    const refreshToken: string = await AuthUtils.createRefreshToken(userId);
    const accessToken: string = AuthUtils.createAccessToken(userId);
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, CookieOption)
      .json({ accessToken, refreshToken });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @DESC issue access token
 * access token 발급
 * RTR 적용
 */

export const getAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 만약 해커가 refresh token payload 상 id를 변경하였을 경우
  // 어차피 Redis에 저장되어있지 않을 것임
  try {
    const { refreshToken } = req.cookies;

    // 1. token 검증(redis + jwt 검증)
    const decoded = await AuthUtils.verifyRefreshToken(refreshToken);
    // 2. 토큰 생성
    const accessToken: string = AuthUtils.createAccessToken(decoded.id);
    const newRefreshToken: string = await AuthUtils.createRefreshToken(
      decoded.id
    );
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, CookieOption)
      .json({ accessToken });
  } catch (error: any) {
    next(error);
  }
};
