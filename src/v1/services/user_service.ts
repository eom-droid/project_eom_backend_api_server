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
import { EncryptUtils } from "../../utils/encrypt_utils";

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
