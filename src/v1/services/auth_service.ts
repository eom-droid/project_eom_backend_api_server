import * as userRepository from "../repositorys/auth_repository";
import * as emailVerifyRepository from "../repositorys/email_verify_repository";
import crypto from "crypto";
import axios from "axios";
import { IUser, User } from "../models/user_model";
import { ProviderType, TokenType } from "../../constant/default";
import jwt from "jsonwebtoken";
import { MailUtils } from "../../utils/mail_utils";
import { EmailVerify } from "../models/email_verify_model";

/**
 * @DESC send verification code
 */

export const sendVerificationCode = async (email: string) => {
  try {
    // 1. 인증번호 생성
    const sixDigitVerificationCode = crypto.randomBytes(3).toString("hex");
    // 2. 인증번호를 이메일로 전송
    const mailResult = await MailUtils.sendMail({
      email,
      subject: "엄태호 플랫폼 인증번호입니다.",
      content: `
                <h1>인증번호입니당.</h1>
                <h1>${sixDigitVerificationCode}</h1>
                `,
    });
    if (mailResult) {
      // 3. 인증번호를 DB에 저장(이메일, 인증번호, 생성시간)
      const emailVerifyModel = new EmailVerify({
        email,
        verificationCode: sixDigitVerificationCode,
        isVerified: false,
      });
      const emailVerify = await emailVerifyRepository.createEmailVerify(
        emailVerifyModel
      );
      return;
    } else {
      throw { status: 500, message: "메일 전송에 실패하였습니다." };
    }
  } catch (error: any) {
    throw error;
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
    //2. 검색 결과가 있으면 만료여부 확인 및 isVerified를 true로 변경
    if (emailVerifyResult !== null) {
      if (emailVerifyResult.isVerified) {
        // 이미 인증된 이메일
        throw { status: 400, message: "이미 인증된 이메일입니다." };
      } else {
        const now = new Date();
        const createdAt = new Date(emailVerifyResult.createdAt);
        const diff = now.getTime() - createdAt.getTime();
        if (diff > 1000 * 60 * 30) {
          throw { status: 400, message: "인증시간이 만료되었습니다." };
        } else {
          await emailVerifyRepository.updateEmailVerify(emailVerifyResult._id, {
            isVerified: true,
          });
        }
      }
    } else {
      // 검색 결과가 없으면 인증번호가 일치하지 않음
      throw { status: 400, message: "인증번호가 일치하지 않습니다." };
    }
    return;
  } catch (error: any) {
    throw error;
  }
};

/**
 * @DESC create new member with kakao
 */
export const createKakaoUser = async (code: string) => {
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

    // 2. 토큰을 이용하여 사용자 정보를 가져온다.
    const userKakao = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakaoAccessToken}` },
    });

    const searchedUser = await userRepository.searchSnsUser({
      snsId: userKakao.data.id,
      provider: ProviderType.KAKAO,
    });

    let user = searchedUser;
    if (searchedUser === null) {
      // 3. User 모델 제작
      const userModel = new User({
        email: userKakao.data.kakao_account.email ?? undefined,
        nick: userKakao.data.properties.nickname,
        provider: ProviderType.KAKAO,
        snsId: userKakao.data.id,
      } as IUser);

      const createdUser = await userRepository.createUser(userModel);
      user = createdUser;
    }

    // 4. 토큰 발급
    const accesToken = createJwt(user!._id.toString(), TokenType.ACCESS);
    const refreshToken = createJwt(user!._id.toString(), TokenType.REFRESH);

    return { accesToken, refreshToken };
  } catch (error: any) {
    throw error;
  }
};

const createJwt = (id: string, tokenType: TokenType) => {
  const token = jwt.sign(
    {
      id,
      tokenType,
    },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: tokenType === TokenType.ACCESS ? "1h" : "14d",
    }
  );

  return token;
};
