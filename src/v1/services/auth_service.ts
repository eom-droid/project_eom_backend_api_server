import * as authRepository from "../repositorys/user_repository";
import * as emailVerifyRepository from "../repositorys/email_verify_repository";
import crypto from "crypto";
import axios from "axios";
import { IUser, User } from "../models/user_model";
import { ProviderType } from "../../constant/default";
import { MailUtils } from "../../utils/mail_utils";
import { EmailVerify } from "../models/email_verify_model";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { AuthUtils } from "../../utils/auth_utils";

/**
 * @DESC email login
 */
export const emailLogin = async (email: string, password: string) => {
  try {
    const exUser = await authRepository.searchUserByEmail(email);
    if (exUser) {
      const result = await bcrypt.compare(password, exUser.password!);
      if (result) {
        return exUser;
      } else {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
    } else {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "가입되지 않은 이메일입니다.",
      });
    }
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC 이메일 중복여부 확인
 * @RETURN true : 중복됨, false : 중복되지 않음
 */
export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  const user = await authRepository.searchUserByEmail(email);
  return user === null ? false : true;
};

/**
 * @DESC send verification code
 */

export const sendVerificationCode = async (email: string) => {
  try {
    // 1. 인증번호 생성
    const sixDigitVerificationCode = crypto.randomBytes(3).toString("hex");
    // 2. 인증번호를 이메일로 전송
    await MailUtils.sendMail({
      email,
      subject: "엄태호 플랫폼 인증번호입니다.",
      content: `
                <h1>인증번호입니당.</h1>
                <h1>${sixDigitVerificationCode}</h1>
                `,
    });
    // 3. 인증번호를 DB에 저장(이메일, 인증번호, 생성시간)
    const emailVerifyModel = new EmailVerify({
      email,
      verificationCode: sixDigitVerificationCode,
    });
    const emailVerify = await emailVerifyRepository.createEmailVerify(
      emailVerifyModel
    );
    return;
  } catch (error: any) {
    throw new CustomHttpErrorModel({
      status: error.status || 500,
      message: error.message || "인증번호 전송에 실패하였습니다.",
    });
  }
};

/**
 * @DESC verify verification code
 */

export const verifyEmail = async (email: string, verificationCode: string) => {
  try {
    // 1. 이메일과 인증번호를 통해 DB에서 검색
    const emailVerifyResult = await emailVerifyRepository.searchEmailVerify(
      email,
      verificationCode
    );
    //2. 검색 결과가 있으면 만료여부 확인
    if (emailVerifyResult !== null) {
      const now = new Date();
      const createdAt = new Date(emailVerifyResult.createdAt);
      const diff = now.getTime() - createdAt.getTime();
      if (diff > 1000 * 60 * 30) {
        throw new CustomHttpErrorModel({
          status: 400,
          message: "인증시간이 만료되었습니다.",
        });
      }
    } else {
      // 검색 결과가 없으면 인증번호가 일치하지 않음
      throw new CustomHttpErrorModel({
        status: 400,
        message: "인증번호가 일치하지 않습니다.",
      });
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create new member with email
 */
export const createEmailUser = async (email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userModel = new User({
      email,
      password: hashedPassword,
      nickName: email.split("@")[0],
    } as IUser);
    const createdUser = await authRepository.createUser(userModel);
    return createdUser;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC delete email verification code
 */

export const deleteEmailVerify = async (email: string) => {
  try {
    await emailVerifyRepository.deleteEmailVerify(email);
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create new member with kakao
 */
export const createKakaoUserByWeb = async (code: string) => {
  try {
    // 1. 사용자가 발급받은 코드를 이용하여 토큰을 발급받는다.
    const result = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: "http://localhost:13001/kakaoCallback",
        code: code,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    const { access_token: kakaoAccessToken, refresh_token: kakaoRefreshToken } =
      result.data;

    return getUserByKakaoToken(kakaoAccessToken);
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create new member with kakao
 */
export const createKakaoUserByApp = async (kakaoAccessToken: string) => {
  try {
    const token = AuthUtils.splitBaererToken(kakaoAccessToken);
    return getUserByKakaoToken(token);
  } catch (error: any) {
    throw error;
  }
};

const getUserByKakaoToken = async (kakaoAccessToken: String) => {
  // 2. 토큰을 이용하여 사용자 정보를 가져온다.
  const userKakao = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${kakaoAccessToken}` },
  });

  const searchedUser = await authRepository.searchSnsUser({
    snsId: userKakao.data.id,
    provider: ProviderType.KAKAO,
  });

  let user = searchedUser;
  if (searchedUser === null) {
    // 3. User 모델 제작
    const userModel = new User({
      email: userKakao.data.kakao_account.email ?? undefined,
      nickName: userKakao.data.properties.nickname,
      provider: ProviderType.KAKAO,
      snsId: userKakao.data.id,
    } as IUser);

    const createdUser = await authRepository.createUser(userModel);
    user = createdUser;
  }
  return user;
};
