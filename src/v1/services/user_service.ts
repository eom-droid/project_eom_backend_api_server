import * as authRepository from "../repositorys/user_repository";

import { AuthUtils } from "../../utils/auth_utils";

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
