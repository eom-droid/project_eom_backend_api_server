import * as authRepository from "../repositorys/user_repository";
import * as emailVerifyRepository from "../repositorys/email_verify_repository";
import crypto from "crypto";
import axios from "axios";
import { User, UserModel, userToUserModel } from "../models/user_model";
import { ProviderType, RoleType, SaltOrRounds } from "../../constant/default";
import { MailUtils } from "../../utils/mail_utils";
import { EmailVerifyModel } from "../models/email_verify_model";
import * as bcrypt from "bcrypt";
import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { AuthUtils } from "../../utils/auth_utils";
import fs from "fs";
import jwt from "jsonwebtoken";

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
 * @DESC reset password
 */
export const resetPassword = async (email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SaltOrRounds);
    const user = await authRepository.updateUserPassword(email, hashedPassword);
    if (user === null) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "가입되지 않은 이메일입니다.",
      });
    }
    return user;
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
    const emailVerifyModel = new EmailVerifyModel({
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
    const hashedPassword = await bcrypt.hash(password, SaltOrRounds);
    const userModel = new UserModel({
      email: email,
      password: hashedPassword,
      nickname: email.split("@")[0],
      role: RoleType.USER,
    });
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
    const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

    if (KAKAO_REDIRECT_URI === undefined || KAKAO_REST_API_KEY === undefined) {
      throw new CustomHttpErrorModel({
        status: 500,
        message: "something went wrong",
      });
    }
    // 1. 사용자가 발급받은 코드를 이용하여 토큰을 발급받는다.
    const result = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
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
 * @DESC get member with google
 */
export const getOrCreateGoogleUserByWeb = async ({
  code,
  redirect_uri,
}: {
  code: string;
  redirect_uri?: string;
}) => {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
      process.env;
    if (
      GOOGLE_CLIENT_ID === undefined ||
      GOOGLE_CLIENT_SECRET === undefined ||
      GOOGLE_REDIRECT_URI === undefined
    ) {
      throw new CustomHttpErrorModel({
        status: 500,
        message: "something went wrong",
      });
    }

    // 1. 사용자가 발급받은 코드를 이용하여 토큰을 발급받는다.
    const result = await axios.post(
      "https://oauth2.googleapis.com/token" +
        "?code=" +
        code +
        "&client_id=" +
        GOOGLE_CLIENT_ID +
        "&client_secret=" +
        GOOGLE_CLIENT_SECRET +
        "&redirect_uri=" +
        (redirect_uri ?? GOOGLE_REDIRECT_URI) +
        "&grant_type=authorization_code",

      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    const {
      access_token: googleAccessToken,
      refresh_token: googleRefreshToken,
    } = result.data;

    return {
      googleAccessToken,
      googleRefreshToken,
      user: await getUserByGoogleToken(googleAccessToken),
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

/**
 * @DESC get member with apple
 */
export const getOrCreateAppleUserByWeb = async ({
  code,
  redirect_uri,
}: {
  code: string;
  redirect_uri?: string;
}) => {
  try {
    const { APPLE_CLIENT_ID, APPLE_REDIRECT_URL } = process.env;
    const apple_client_secret = AuthUtils.createAppleClientSecret();

    // 2. 토큰을 이용하여 사용자 정보를 가져온다.
    const response = await axios.post(
      "https://appleid.apple.com/auth/token",
      {
        client_id: APPLE_CLIENT_ID,
        client_secret: apple_client_secret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri ?? APPLE_REDIRECT_URL,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const apple_access_token = response.data.access_token;
    const apple_refresh_token = response.data.refresh_token;

    const { sub: appleId } = jwt.decode(
      response.data.id_token
    ) as jwt.JwtPayload;

    if (appleId === undefined) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "apple id is undefined",
      });
    }

    const searchedUser = await authRepository.searchSnsUser({
      snsId: appleId,
      provider: ProviderType.APPLE,
    });

    let user = searchedUser;
    if (searchedUser === null) {
      // 3. User 모델 제작
      const userModel = new UserModel({
        email: undefined,
        nickname: "엄티#" + Math.floor(Math.random() * 1000),
        provider: ProviderType.APPLE,
        snsId: appleId,
        role: RoleType.USER,
      });

      const createdUser = await authRepository.createUser(userModel);
      user = createdUser;
    }
    return {
      apple_access_token,
      apple_refresh_token,
      apple_client_secret,
      user,
    };
  } catch (error: any) {
    console.log(error);
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
    const userModel = new UserModel({
      email: userKakao.data.kakao_account.email ?? undefined,
      nickname: userKakao.data.properties.nickname,
      provider: ProviderType.KAKAO,
      snsId: userKakao.data.id,
      role: RoleType.USER,
    });

    const createdUser = await authRepository.createUser(userModel);
    user = createdUser;
  }
  return user!;
};

const getUserByGoogleToken = async (googleAccessToken: String) => {
  // 2. 토큰을 이용하여 사용자 정보를 가져온다.
  const userGoogle = await axios.get(
    "https://www.googleapis.com/userinfo/v2/me?access_token=" +
      googleAccessToken
  );

  console.log(userGoogle.data);

  const searchedUser = await authRepository.searchSnsUser({
    snsId: userGoogle.data.id,
    provider: ProviderType.GOOGLE,
  });

  let user = searchedUser;
  if (searchedUser === null) {
    // 3. User 모델 제작
    const userModel = new UserModel({
      email: userGoogle.data.email ?? undefined,
      nickname: "엄티#" + Math.floor(Math.random() * 1000),
      provider: ProviderType.GOOGLE,
      snsId: userGoogle.data.id,
      role: RoleType.USER,
    });

    const createdUser = await authRepository.createUser(userModel);
    user = createdUser;
  }
  return user;
};
