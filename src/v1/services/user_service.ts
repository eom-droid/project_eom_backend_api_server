import * as authRepository from "../repositorys/user_repository";

import { AuthUtils } from "../../utils/auth_utils";

/**
 * @DESC email login
 */
export const getMyInfo = async (authorizationValue: string) => {
  try {
    const decryptedUserId = AuthUtils.verifyAccessToken(
      AuthUtils.splitBaererToken(authorizationValue)
    ).id;

    const user = await authRepository.searchUserById(decryptedUserId);

    return user;
  } catch (error: any) {
    throw error;
  }
};
