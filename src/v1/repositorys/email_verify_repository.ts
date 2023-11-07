import { ObjectId, Types } from "mongoose";
import { EmailVerify, EmailVerifyModel } from "../models/email_verify_model";

/**
 * @DESC create new User
 * mongoDB에 새로운 user를 생성함
 */
export const createEmailVerify = async (emailVerify: EmailVerify) => {
  try {
    const emailVerifyInstance = emailVerify.toEmailVerifyModel();
    // save 하기
    const savedEmailVerify = await emailVerifyInstance.save();
    return savedEmailVerify;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC search EmailVerify
 * mongoDB에 email의 인증번호와 일치하는 항목 있는지 여부 확인
 */

export const searchEmailVerify = async (
  email: string,
  verificationCode: string
) => {
  try {
    const result = EmailVerifyModel.findOne({
      email,
      verificationCode,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @DESC update EmailVerify
 * mongoDB에 email의 인증번호와 일치하는 항목 있는지 여부 확인
 * 일치하는 항목이 있다면 isVerified를 true로 변경
 */
export const updateEmailVerify = async (
  id: Types.ObjectId,
  updateObj: Object
) => {
  try {
    const result = EmailVerifyModel.updateOne({ _id: id }, updateObj);
    return result;
  } catch (error) {
    throw error;
  }
};
