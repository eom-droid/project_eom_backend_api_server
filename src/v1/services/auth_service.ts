import * as userRepository from "../repositorys/auth_repository";

import axios from "axios";
import { IUser, User } from "../models/user_model";
import { ProviderType, TokenType } from "../../constant/default";
import jwt from "jsonwebtoken";

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
    console.log(new Date().toISOString() + ": npm log: " + error);

    throw { status: error?.status || 400, message: error?.message || error };
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
