import * as authRepository from "../repositorys/user_repository";
import { User } from "../models/user_model";

/**
 * @DESC email login
 * 현재는 사용 안함
 */
// export const getMyInfo = async (authorizationValue: string) => {
//   try {
//     const decryptedUserId = AuthUtils.verifyAccessToken(
//       AuthUtils.splitBaererToken(authorizationValue)
//     ).id;

//     const user = await authRepository.searchUserById(decryptedUserId);

//     return user;
//   } catch (error: any) {
//     throw error;
//   }
// };

/**
 * @DESC update user nickname
 * user의 nickname을 변경
 */

export const updateNickname = async (userId: string, nickname: string) => {
  try {
    await authRepository.updateNickname(userId, nickname);
  } catch (error: any) {
    throw error;
  }
};

export const deleteUser = async (user: User, userId: string) => {
  try {
    if (user.provider === undefined) {
      await authRepository.deleteUser(userId);
    } else if (user.provider === "google") {
      // await authRepository.deleteGoogleUser(user);
    } else if (user.provider === "kakao") {
      // await authRepository.deleteKakaoUser(user);
    } else if (user.provider === "apple") {
      // await authRepository.deleteNaverUser(user);
    } else {
      throw new Error("provider error");
    }
  } catch (error) {
    throw error;
  }
};
